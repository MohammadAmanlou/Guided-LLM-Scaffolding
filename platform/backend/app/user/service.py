from ..db import (
    insert_one,
    find_all,
    find_one,
    update_one,
    delete_one
)
from .model import User
from .interface import UserInterface
from typing import List, Optional

COLLECTION = "users"

class UserService:
    def create(self, attrs: UserInterface) -> str:
        return insert_one(COLLECTION, attrs)

    def get_all(self) -> List[User]:
        docs = find_all(COLLECTION)
        return [User(d["_id"], d["username"], d["password"], d["role"]) for d in docs]

    def get_by_id(self, user_id: str) -> Optional[User]:
        doc = find_one(COLLECTION, user_id)
        if not doc:
            return None
        return User(doc["_id"], doc["username"], doc["password"], doc["role"])

    def get_by_username(self, username: str) -> Optional[User]:
        from ..db import get_db
        raw = get_db()[COLLECTION].find_one({"username": username})
        if not raw:
            return None
        raw["_id"] = str(raw["_id"])
        return User(raw["_id"], raw["username"], raw["password"], raw["role"])

    def update(self, user: User, changes: UserInterface) -> User:
        """
        Only updates the provided fields via update_one, so we never
        try to change _id.
        """
        # persist to Mongo
        success = update_one(COLLECTION, user.user_id, changes)
        if not success:
            raise ValueError(f"User {user.user_id} not found")

        # reflect in-memory
        for k, v in changes.items():
            setattr(user, k, v)
        return user

    def delete_by_id(self, user_id: str) -> bool:
        return delete_one(COLLECTION, user_id)
