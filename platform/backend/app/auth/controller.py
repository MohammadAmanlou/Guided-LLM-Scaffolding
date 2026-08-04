from flask import request, jsonify
from flask_restx import Resource, Namespace
from marshmallow import ValidationError
from flask_accepts import accepts, responds
from app.utils import permissions_required

from .service import AuthService
from .schema import (
    RegisterUserSchema,
    LoginSchema,
    RefreshTokenSchema,
    ChangePasswordSchema  # Add this schema for validation
)

# Create namespace for auth endpoints
api = Namespace("auth", description="Authentication operations")

# Initialize schemas
user_registration_schema = RegisterUserSchema()
user_login_schema = LoginSchema()
refresh_token_schema = RefreshTokenSchema()
change_password_schema = ChangePasswordSchema()  # Add this schema for password change

# Initialize service
auth_service = AuthService()

@api.route("/register")
# @permissions_required('admin')
class UserRegistration(Resource):
    @api.doc("register_user")
    @api.response(201, "User registered successfully")
    @api.response(400, "Validation error")
    @api.response(409, "User already exists")
    @accepts(schema=RegisterUserSchema, api=api)
    def post(self):
        """Register a new user"""
        try:
            # Validate input data
            data = user_registration_schema.load(request.json)

            # Register user
            username = auth_service.register(data)

            return {
                "message": "User registered successfully",
                "data": {"username": username}
            }, 201

        except ValidationError as e:
            return {"message": "Validation error", "errors": e.messages}, 400
        except ValueError as e:
            return {"message": str(e)}, 409
        except Exception as e:
            return {"message": "Internal server error"}, 500


@api.route("/login")
class UserLogin(Resource):
    @api.doc("login_user")
    @api.response(200, "Login successful", {})
    @api.response(400, "Validation error")
    @api.response(401, "Invalid credentials")
    @accepts(schema=LoginSchema, api=api)
    def post(self):
        """Login user and return tokens"""
        try:
            # Validate input data
            data = user_login_schema.load(request.json)

            # Login user
            tokens = auth_service.login(data)

            return tokens, 200

        except ValidationError as e:
            return {"message": "Validation error", "errors": e.messages}, 400
        except ValueError as e:
            return {"message": str(e)}, 401
        except Exception as e:
            return {"message": "Internal server error"}, 500
        

@api.route("/change_password")
class ChangePassword(Resource):
    @api.doc("change_user_password")
    @api.response(200, "Password changed successfully")
    @api.response(400, "Validation error")
    @api.response(401, "Unauthorized")
    @accepts(schema=ChangePasswordSchema, api=api)  # Use schema for validation
    def post(self):
        """Change password after first login"""
        try:
            # Validate input data (old password and new password)
            data = change_password_schema.load(request.json)

            # Call the service to handle the password change logic
            result = auth_service.change_password(data)

            return result, 200

        except ValidationError as e:
            return {"message": "Validation error", "errors": e.messages}, 400
        except Exception as e:
            return {"message": "Internal server error"}, 500


@api.route("/refresh")
class TokenRefresh(Resource):
    @accepts(schema=RefreshTokenSchema, api=api)
    @api.doc("refresh_token")
    @api.response(200, "Token refreshed successfully", {})
    @api.response(400, "Validation error")
    @api.response(401, "Invalid refresh token")
    def post(self):
        """Refresh access token using refresh token"""
        try:
            # Validate input data
            data = refresh_token_schema.load(request.json)

            # Refresh token
            tokens = auth_service.refresh(data["refresh_token"])

            return tokens, 200

        except ValidationError as e:
            return {"message": "Validation error", "errors": e.messages}, 400
        except ValueError as e:
            return {"message": str(e)}, 401
        except Exception as e:
            return {"message": "Internal server error"}, 500


@api.route("/logout")
class UserLogout(Resource):
    @accepts(schema=RefreshTokenSchema, api=api)
    @api.doc("logout_user")
    @api.response(200, "Logout successful")
    @api.response(400, "Validation error")
    def post(self):
        """Logout user by revoking refresh token"""
        try:
            # Validate input data
            data = refresh_token_schema.load(request.json)

            # Logout user
            success = auth_service.logout(data["refresh_token"])

            if success:
                return {"message": "Logout successful"}, 200
            else:
                return {"message": "Invalid refresh token"}, 400

        except ValidationError as e:
            return {"message": "Validation error", "errors": e.messages}, 400
        except Exception as e:
            return {"message": "Internal server error"}, 500

