
import csv
import requests
import json

# Constants
API_URL = "/api/api/auth/register"
CSV_FILE = "users.csv"

def delete_all_users():
    """Fetch all users and delete them one by one."""
    try:
        API_URL = "/api"
        response = requests.get(f"{API_URL}/api/users/")
        if response.status_code != 200:
            print(f"❌ Failed to fetch users — {response.status_code}: {response.text}")
            return

        users = response.json()
        count = 0

        for user in users:
            user_id = user.get("id") or user.get("_id")  # depending on your schema
            if user_id:
                del_resp = requests.delete(f"{API_URL}/api/users/{user_id}")
                if del_resp.status_code == 204:
                    count += 1
                else:
                    print(f"⚠️ Failed to delete user {user_id}: {del_resp.status_code}")

        print(f"🧹 Deleted {count} users.")

    except Exception as e:
        print(f"🚫 Error deleting users: {e}")

def register_user(email, password, first_name, last_name):
    payload = {
        "username": email,
        "password": password,
        "first_name": first_name,
        "last_name": last_name,
        "role": "restricted-student"
    }

    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(API_URL, headers=headers, data=json.dumps(payload))

        if response.status_code in (200, 201):
            print(f"✅ Created user: {email}")
        else:
            print(f"❌ Failed to create {email} — {response.status_code}: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"🚫 Network error for {email}: {e}")

def main():
    try:
        with open(CSV_FILE, newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                email = row.get("Gmail", "").strip()
                password = row.get("Password", "").strip()
                first_name = row.get("First Name", "").strip()
                last_name = row.get("Last Name", "").strip()

                if not email or not password:
                    print(f"⚠️ Skipping row with missing email or password: {row}")
                    continue

                register_user(email, password, first_name, last_name)

    except FileNotFoundError:
        print(f"❌ File '{CSV_FILE}' not found.")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    # delete_all_users()
    main()
