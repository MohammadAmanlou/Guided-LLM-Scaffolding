import json
import jwt
import bcrypt
import secrets
from datetime import datetime, timedelta
from typing import Optional, Tuple
from flask import current_app
from bson import ObjectId
from ..db import get_db
from .model import User, RefreshToken
from .interface import UserInterface, LoginInterface, TokenResponse, UserResponse, ChangePasswordInterface

class AuthService:

    def _hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

    def _verify_password(self, password: str, password_hash: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))

    def _generate_tokens(self, username: str, permissions: list[str]) -> Tuple[str, str]:
        """Generate access and refresh tokens"""
        access_token_payload = {
            "permissions": permissions,
            "sub": username,
            "username": username,
            "exp": datetime.utcnow() + timedelta(seconds=current_app.config["JWT_ACCESS_TOKEN_EXPIRES"]),
            "iat": datetime.utcnow(),
            "type": "access",
        }
        access_token = jwt.encode(
            access_token_payload,
            current_app.config["JWT_SECRET_KEY"],
            algorithm="HS256",
        )

        refresh_token = secrets.token_urlsafe(32)
        refresh_token_hash = self._hash_password(refresh_token)

        return access_token, refresh_token, refresh_token_hash


    def get_permissions_for_role(self, role: str) -> list[str]:
        """Return the permissions based on the user's role"""
        if role == 'admin':
            return ['admin', 'base-student', 'LLM']
        elif role == 'restricted-student':
            return ['base-student']
        elif role == 'normal-student':
            return ['base-student', 'LLM']
        else:
            raise ValueError("Invalid role")


    def register(self, user_data: UserInterface):
        """Register a new user"""
        existing_user = get_db()["users"].find_one({"username": user_data["username"]})
        if existing_user:
            raise ValueError("User with this username already exists")

        id = str(ObjectId())

        role = user_data["role"]
        permissions = self.get_permissions_for_role(role)

        hashed_password = self._hash_password(user_data["password"])

        user = User(
            username=user_data["username"],
            first_name=user_data["first_name"],
            last_name=user_data["last_name"],
            role=role,
            permissions=permissions,
        )

        get_db()["users"].insert_one({
            **user.to_dict(),
            "password": hashed_password
        })
        return user_data["username"]

    def login(self, login_data: LoginInterface) -> TokenResponse:
        """Authenticate user and return tokens"""
        user_data = get_db()["users"].find_one({"username": login_data["username"]})
        if not user_data:
            raise ValueError("Invalid username or password")

        user = User.from_dict(user_data)

        if not user.is_active:
            raise ValueError("User account is deactivated")

        if not self._verify_password(login_data["password"], user_data["password"]):
            raise ValueError("Invalid username or password")
        
        # Check if it's the user's first login
        if user.is_first_login:
            # Inform the frontend that the user needs to change their password
            return {
                "message": "Password change required",
                "change_password_required": True
            }, 200

        permissions = user.permissions

        access_token, refresh_token, refresh_token_hash = self._generate_tokens(
            user.username, permissions
        )

        refresh_token_obj = RefreshToken(
            token_id=str(ObjectId()),
            username=user.username,
            token_hash=refresh_token_hash,
            expires_at=datetime.utcnow() + timedelta(seconds=current_app.config["JWT_REFRESH_TOKEN_EXPIRES"]),
        )

        get_db()["refresh_tokens"].insert_one(refresh_token_obj.to_dict())

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "Bearer",
            "expires_in": current_app.config["JWT_ACCESS_TOKEN_EXPIRES"],
            "username": user_data["username"],
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    
    
    def change_password(self, data: ChangePasswordInterface):
        """Change user password after first login"""
        username = data["username"]
        old_password = data["old_password"]
        new_password = data["new_password"]

        # Retrieve the user from the database
        user_data = get_db()["users"].find_one({"username": username})
        if not user_data:
            raise ValueError("User not found")

        user = User.from_dict(user_data)

        # Verify the old password
        if not self._verify_password(old_password, user_data["password"]):
            raise ValueError("Incorrect old password")

        # Hash the new password and update the user document
        new_hashed_password = self._hash_password(new_password)

        # Update the user's password and set is_first_login to False
        get_db()["users"].update_one(
            {"username": username},
            {"$set": {"password": new_hashed_password, "is_first_login": False}}  # Set is_first_login to False
        )

        return {"message": "Password changed successfully"}


    def refresh(self, refresh_token: str) -> TokenResponse:
        """Refresh access token using refresh token"""
        refresh_token_data = get_db()["refresh_tokens"].find_one(
            {"is_revoked": False, "expires_at": {"$gt": datetime.utcnow()}}
        )

        if not refresh_token_data:
            raise ValueError("Invalid or expired refresh token")

        refresh_token_obj = RefreshToken.from_dict(refresh_token_data)
        if not self._verify_password(refresh_token, refresh_token_obj.token_hash):
            raise ValueError("Invalid refresh token")

        get_db()["refresh_tokens"].update_one(
            {"_id": refresh_token_obj.token_id}, {"$set": {"is_revoked": True}}
        )

        user_data = get_db()["users"].find_one(
            {"username": refresh_token_obj.username}
        )
        if not user_data:
            raise ValueError("User not found")

        access_token, new_refresh_token, new_refresh_token_hash = self._generate_tokens(
            refresh_token_obj.username,
            user_data["permissions"],
        )

        new_refresh_token_obj = RefreshToken(
            token_id=str(ObjectId()),
            username=refresh_token_obj.username,
            token_hash=new_refresh_token_hash,
            expires_at=datetime.utcnow()
            + timedelta(seconds=current_app.config["JWT_REFRESH_TOKEN_EXPIRES"]),
        )

        get_db()["refresh_tokens"].insert_one(new_refresh_token_obj.to_dict())

        return {
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "token_type": "Bearer",
            "expires_in": current_app.config["JWT_ACCESS_TOKEN_EXPIRES"],
        }

    def logout(self, refresh_token: str) -> bool:
        """Logout user by revoking refresh token"""
        result = get_db()["refresh_tokens"].update_one(
            {"is_revoked": False, "expires_at": {"$gt": datetime.utcnow()}},
            {"$set": {"is_revoked": True}},
        )

        return result.modified_count > 0

    def get_user_by_id(self, username: str) -> Optional[User]:
        """Get user by ID"""
        user_data = get_db()["users"].find_one({"_id": username})
        if user_data:
            return User.from_dict(user_data)
        return None

    def verify_token(self, token: str) -> Optional[str]:
        """Verify JWT token and return user_id"""
        try:
            payload = jwt.decode(
                token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"]
            )
            return payload.get("username")
        except jwt.ExpiredSignatureError:
            raise ValueError("Token has expired")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid token")

    def get_user_response(self, user: User) -> UserResponse:
        """Convert user to response format"""
        return {
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_active": user.is_active,
        }

