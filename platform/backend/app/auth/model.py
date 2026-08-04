from datetime import datetime
from typing import Optional

class User:
    def __init__(self, username: str, first_name: str, last_name: str, role: str,
                 permissions: list[str], is_active: bool = True, is_first_login: bool = True,
                 created_at: Optional[datetime] = None, updated_at: Optional[datetime] = None):
        self.username = username
        self.first_name = first_name
        self.last_name = last_name
        self.role = role
        self.permissions = permissions  # Store permissions
        self.is_active = is_active
        self.is_first_login = is_first_login  # New field to track first login
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self) -> dict:
        return {
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "role": self.role,  # Include role
            "permissions": self.permissions,  # Include permissions
            "is_active": self.is_active,
            "is_first_login": self.is_first_login,  # Include is_first_login
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            username=data["username"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            role=data["role"],
            permissions=data["permissions"],  # Include permissions
            is_active=data.get("is_active", True),
            is_first_login=data.get("is_first_login", True),  # Read is_first_login
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at")
        )



class RefreshToken:
    def __init__(self, token_id: str, username: str, token_hash: str, 
                 expires_at: datetime, is_revoked: bool = False,
                 created_at: Optional[datetime] = None):
        self.token_id = token_id
        self.username = username
        self.token_hash = token_hash
        self.expires_at = expires_at
        self.is_revoked = is_revoked
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self):
        return {
            "_id": self.token_id,
            "username": self.username,
            "token_hash": self.token_hash,
            "expires_at": self.expires_at,
            "is_revoked": self.is_revoked,
            "created_at": self.created_at
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            token_id=data["_id"],
            username=data["username"],
            token_hash=data["token_hash"],
            expires_at=data["expires_at"],
            is_revoked=data.get("is_revoked", False),
            created_at=data.get("created_at")
        )