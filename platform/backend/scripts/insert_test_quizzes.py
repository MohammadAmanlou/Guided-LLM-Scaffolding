
import os, sys
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from bson import Binary

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

load_dotenv()

from app.db import init_db, get_db, delete_all
from app.quiz.service import QuizService

def insert_answer_sheet_directly(quiz_id: int, filename: str, content: bytes):
    """Direct DB insert since upload function doesn't exist in service."""
    get_db()["quiz_answer_sheets"].update_one(
        {"quizId": quiz_id},
        {
            "$set": {
                "fileName": filename,
                "fileData": Binary(content),
                "uploadedAt": datetime.now(timezone.utc).isoformat(),
            }
        },
        upsert=True,
    )

def insert_quiz_questions_directly(quiz_id: int, filename: str, content: bytes):
    """Direct DB insert since upload function doesn't exist in service."""
    get_db()["quiz_questions"].update_one(
        {"quizId": quiz_id},
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
    
    print("== Deleting Old Quizzes ==")
    deleted_count = delete_all("quizzes")
    deleted_count = delete_all("quiz_questions")
    print(f"🗑️  Deleted {deleted_count} old quizzes")


    service = QuizService()

    print("== Inserting Test Quizzes ==")
    quizzes = [
        {
            "id": 1,
            "name": "کوییز اول",
            "startTime": "2025-08-02T16:30:00Z",
            "endTime": "2025-08-02T17:30:00Z",
            "expectedTime": 50,
            "totalScore": 10
        },
	{
            "id": 2,
            "name": "کوییز دوم",
            "startTime": "2025-08-10T14:30:00Z",
            "endTime": "2025-08-10T16:30:00Z",
            "expectedTime": 100,
            "totalScore": 10
        },
	{
            "id": 3,
            "name": "کوییز سوم",
            "startTime": "2025-08-22T17:30:00Z",
            "endTime": "2025-08-22T19:00:00Z",
            "expectedTime": 75,
            "totalScore": 10
        },
    ]

    for q in quizzes:
        quiz_id = service.create(q)
        print(f"✅ Inserted Quiz ID: {quiz_id}")
        
    print("\n== Uploading Answer Sheets If Available ==")
    data_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "app", "quiz", "data","answersheets"))

    for q in quizzes:
        quiz_id = q["id"]
        filename = f"quiz_{quiz_id}_answersheet.pdf"
        pdf_path = os.path.join(data_folder, filename)
        
        if os.path.exists(pdf_path):
            with open(pdf_path, "rb") as f:
                pdf_content = f.read()
            insert_answer_sheet_directly(quiz_id, filename, pdf_content)
            print(f"📄 Uploaded Answer Sheet for Quiz {quiz_id} ({filename})")
        else:
            print(f"⚠️  No Answer Sheet Found for Quiz {quiz_id} (expected: {filename})")
    
    
    
    print("\n== Uploading Quiz Questions If Available ==")
    data_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "app", "quiz", "data","questions"))

    for q in quizzes:
        quiz_id = q["id"]
        filename = f"quiz_{quiz_id}.pdf"
        pdf_path = os.path.join(data_folder, filename)
        
        if os.path.exists(pdf_path):
            with open(pdf_path, "rb") as f:
                pdf_content = f.read()
            insert_quiz_questions_directly(quiz_id, filename, pdf_content)
            print(f"📄 Uploaded Questions for Quiz {quiz_id} ({filename})")
        else:
            print(f"⚠️  No Questions Found for Quiz {quiz_id} (expected: {filename})")





if __name__ == "__main__":
    main()
