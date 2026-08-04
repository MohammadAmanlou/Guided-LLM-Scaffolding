
import os, sys
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from bson import Binary

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

load_dotenv()

from app.db import init_db, get_db, delete_all
from app.practice.service import PracticeService

def insert_answer_sheet_directly(practice_id: int, filename: str, content: bytes):
    """Direct DB insert since upload function doesn't exist in service."""
    get_db()["answer_sheets"].update_one(
        {"practiceId": practice_id},
        {
            "$set": {
                "fileName": filename,
                "fileData": Binary(content),
                "uploadedAt": datetime.now(timezone.utc).isoformat(),
            }
        },
        upsert=True,
    )


def main():
    init_db()  # Initialize the database connection
    
    print("== Deleting Old Practices ==")
    deleted_count = delete_all("practices")
    print(f"🗑️  Deleted {deleted_count} old practices")


    service = PracticeService()

    print("== Inserting Test Practices ==")
    practices = [
        {
            "id": 1,
            "name": "تمرین الف",
            "startTime": "2025-07-25T17:30:00Z",
            "endTime": "2025-07-31T20:29:00Z",
            #"expectedTime": 60,
            "totalScore": 100,
            "questions": [
                {"id": 101, "imageUrl": "https://i.ibb.co/zhLbNgPX/p1-question-1.jpg"},
                {"id": 102, "imageUrl": "https://i.ibb.co/N2DkQqTc/p1-question-2.jpg"},
                {"id": 103, "imageUrl": "https://i.ibb.co/kTHcX1c/p1-question-3.jpg"},
                {"id": 104, "imageUrl": "https://i.ibb.co/VYPFswHw/p1-question-4.png"},
                {"id": 105, "imageUrl": "https://i.ibb.co/QjTbfbZX/p1-question-5.png"},
                {"id": 106, "imageUrl": "https://i.ibb.co/j9fQMjtR/p1-question-6.png"},
            ],
            "state": "NOT_STARTED_YET",
        },
        {
            "id": 2,
            "name": "تمرین ب",
            "startTime": "2025-08-03T20:31:00Z",
            "endTime": "2025-08-09T20:29:00Z",
            #"expectedTime": 60,
            "totalScore": 100,
            "questions": [
                {"id": 201, "imageUrl": "https://i.ibb.co/S4QdvWqB/p2-question-1.jpg"},
                {"id": 202, "imageUrl": "https://i.ibb.co/NdCFpBnk/p2-question-2.jpg"},
                {"id": 203, "imageUrl": "https://i.ibb.co/ccLzktTk/p2-question-3.jpg"},
                {"id": 204, "imageUrl": "https://i.ibb.co/9kbbDcmp/p2-question-4.jpg"},
                {"id": 205, "imageUrl": "https://i.ibb.co/4RgjbZCC/p2-question-5.jpg"},
                {"id": 206, "imageUrl": "https://i.ibb.co/k2N0ZfNN/p2-question-6.jpg"},
            ],
            "state": "NOT_STARTED_YET",
        },
	{
            "id": 3,
            "name": "تمرین ج",
            "startTime": "2025-08-11T22:01:00Z",
            "endTime": "2025-08-17T20:29:00Z",
            #"expectedTime": 60,
            "totalScore": 100,
            "questions": [
                {"id": 301, "imageUrl": "https://i.ibb.co/JfyZS4p/p3-question-1.png"},
                {"id": 302, "imageUrl": "https://i.ibb.co/99Ks4FgN/p3-question-2.png"},
                {"id": 303, "imageUrl": "https://i.ibb.co/FqkZrfPF/p3-question-3.png"},
                {"id": 304, "imageUrl": "https://i.ibb.co/jvMtGk5G/p3-question-4.png"},
                {"id": 305, "imageUrl": "https://i.ibb.co/cSbBd3FY/p3-question-5.png"},
                {"id": 306, "imageUrl": "https://i.ibb.co/Tq46NFZQ/p3-question-6.png"},
            ],
            "state": "NOT_STARTED_YET",
        }
 
    ]

    for p in practices:
        practice_id = service.create(p)
        print(f"✅ Inserted Practice ID: {practice_id}")
        
    print("\n== Uploading Answer Sheets If Available ==")
    data_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "app", "practice", "data"))

    for p in practices:
        practice_id = p["id"]
        filename = f"practice_{practice_id}_answersheet.pdf"
        pdf_path = os.path.join(data_folder, filename)
        
        if os.path.exists(pdf_path):
            with open(pdf_path, "rb") as f:
                pdf_content = f.read()
            insert_answer_sheet_directly(practice_id, filename, pdf_content)
            print(f"📄 Uploaded Answer Sheet for Practice {practice_id} ({filename})")
        else:
            print(f"⚠️  No Answer Sheet Found for Practice {practice_id} (expected: {filename})")



if __name__ == "__main__":
    main()
