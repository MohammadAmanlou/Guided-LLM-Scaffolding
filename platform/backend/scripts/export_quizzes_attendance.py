import os
import sys
import json
from dotenv import load_dotenv

# Adjust sys path to access app.db
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

load_dotenv()
from app.db import init_db, get_db


def export_quiz_attendance(output_path="quizzes_attendance.json"):
    db = get_db()
    collection = db["quizzesAttendance"]
    records = list(collection.find({}))

    for doc in records:
        doc["_id"] = str(doc["_id"])  # Convert ObjectId to string

    dir_path = os.path.dirname(output_path)
    if dir_path:  # ✅ only make directory if it's not empty
        os.makedirs(dir_path, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=4, ensure_ascii=False)

    print(f"✅ Exported {len(records)} quiz attendance records to {output_path}")


def main():
    init_db()
    export_quiz_attendance()


if __name__ == "__main__":
    main()
