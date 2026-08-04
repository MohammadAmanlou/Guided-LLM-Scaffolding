import csv
import os
import sys
from dotenv import load_dotenv
from pymongo import MongoClient

# Load .env and connect to db
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
load_dotenv()

from app.db import init_db, get_db  # اگر app.db استفاده می‌کنی

def add_llm_to_group_members(csv_path="group_assigments.csv"):
    db = get_db()
    users = db["users"]

    updated_count = 0

    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            email = row['Username'].strip()
            group = row['Group'].strip()

            if group not in ["Group 2", "Group 3"]:
                continue

            user = users.find_one({ "username": email })

            if not user:
                print(f"❌ User not found: {email}")
                continue

            permissions = user.get("permissions", [])

            if "LLM" not in permissions:
                permissions.append("LLM")
                users.update_one(
                    { "username": email },
                    { "$set": { "permissions": permissions } }
                )
                updated_count += 1
                print(f"✅ Updated: {email}")
            else:
                print(f"🔁 Already has LLM: {email}")

    print(f"\n🎯 Total users updated: {updated_count}")

if __name__ == "__main__":
    init_db()
    add_llm_to_group_members()
