import os, sys
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

load_dotenv()

from app.db import init_db
init_db()

from app.user.service import UserService

def main():
    service = UserService()

    print("== Creating user ==")
    attrs = {"username": "testuser", "password": "secret123", "role": "student_plain"}
    user_id = service.create(attrs)
    print("→ New user ID:", user_id)

    print("\n== Fetching user by ID ==")
    user = service.get_by_id(user_id)
    print("→", user.to_dict() if user else "Not found")

    print("\n== Updating role to 'admin' ==")
    updated = service.update(user, {"role": "admin"})
    print("→", updated.to_dict())

    print("\n== Listing all users ==")
    for u in service.get_all():
        print("  •", u.to_dict())

    print("\n== Deleting user ==")
    deleted = service.delete_by_id(user_id)
    print("→ Deleted?", deleted)

    print("\n== Confirm deletion ==")
    print("→", service.get_by_id(user_id))

if __name__ == "__main__":
    main()
