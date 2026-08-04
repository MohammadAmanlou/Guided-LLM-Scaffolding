import os
import sys
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

load_dotenv()
from app.db import init_db, get_db


def sanitize_filename(s):
    return s.replace("@", "_at_").replace(".", "_")


def download_user_answers(practice_ids, base_dir="practice"):
    db = get_db()
    answers = db["answers"].find({"practiceId": {"$in": practice_ids}})
    count = 0

    for doc in answers:
        practice_id = doc.get("practiceId")
        question_id = doc.get("questionId")
        user_id = doc.get("userId")
        file_data = doc.get("fileData")
        file_name = doc.get("fileName", f"answer_{question_id}.bin")

        if not all([practice_id, question_id, user_id, file_data]):
            continue

        user_folder = os.path.join(base_dir, f"practice_{practice_id}", sanitize_filename(user_id))
        os.makedirs(user_folder, exist_ok=True)

        file_path = os.path.join(user_folder, file_name)
        with open(file_path, "wb") as f:
            f.write(file_data)

        count += 1
        print(f"✅ Answer saved: {file_path}")

    return count


def download_answer_sheets(practice_ids, base_dir="practice"):
    db = get_db()
    sheets = db["answer_sheets"].find({"practiceId": {"$in": practice_ids}})
    count = 0

    for doc in sheets:
        practice_id = doc.get("practiceId")
        file_data = doc.get("fileData")
        file_name = doc.get("fileName", f"answersheet_practice_{practice_id}.pdf")

        if not practice_id or not file_data:
            continue

        folder_path = os.path.join(base_dir, f"practice_{practice_id}")
        os.makedirs(folder_path, exist_ok=True)

        file_path = os.path.join(folder_path, file_name)
        with open(file_path, "wb") as f:
            f.write(file_data)

        count += 1
        print(f"📄 Sheet saved: {file_path}")

    return count


if __name__ == "__main__":
    import sys
    init_db()

    # Convert to integers so they match MongoDB's practiceId type
    if len(sys.argv) > 1:
        practice_ids = [int(pid) for pid in sys.argv[1:]]
    else:
        practice_ids = None  # download all

    print(f"\n📥 Downloading user-uploaded answers for practices: {practice_ids}")
    a = download_user_answers(practice_ids=practice_ids)
    print(f"✅ Total user answers saved: {a}")

    print(f"\n📥 Downloading official answer sheets for practices: {practice_ids}")
    s = download_answer_sheets(practice_ids=practice_ids)
    print(f"✅ Total answer sheets saved: {s}")
