from typing import List, Dict, Optional
from datetime import datetime, timezone
from ..db import get_db
from .model import Quiz
from ..db import get_db
from typing import List, Optional
from datetime import datetime, timedelta, timezone
from bson import Binary
from io import BytesIO
from .interface import QuizInterface

COLLECTION = "quizzes"
USER_COLLECTION = "quiz_users"




class QuizService:
    
    def create(self, attrs: QuizInterface) -> str:
        """Insert a new quiz."""
        result = get_db()[COLLECTION].insert_one(attrs)
        return str(result.inserted_id)

    def _auto_finalize_if_needed(self, quiz_id: int, user_id: str, end_time: str):
        """Automatically finalize if deadline has passed."""
        now = datetime.now(timezone.utc)
        deadline = datetime.fromisoformat(end_time.replace("Z", "+00:00"))

        user_data = get_db()[USER_COLLECTION].find_one(
            {"userId": user_id, "quizId": quiz_id}, {"_id": 0}
        )

        if now > deadline and not user_data:
            get_db()[USER_COLLECTION].update_one(
                {"userId": user_id, "quizId": quiz_id},
                {"$set": {"finalized": True}},
                upsert=True,
            )
            return True
        return False
    

    def get_all(self, user_id: str) -> List[Quiz]:
        """Fetch all practices, add user-specific data + auto-finalize if needed."""
        docs = list(get_db()[COLLECTION].find({}))
        for d in docs:
            d.pop("_id", None)

            user_data = get_db()[USER_COLLECTION].find_one(
                {"userId": user_id, "quizId": d["id"]}, {"_id": 0}
            ) or {}

            # ✅ Auto finalize check
            self._auto_finalize_if_needed(d["id"], user_id, d["endTime"])
            user_data = get_db()[USER_COLLECTION].find_one(
                {"userId": user_id, "quizId": d["id"]}, {"_id": 0}
            ) or {}

            started_at = user_data.get("startedAt")
            finalized = user_data.get("finalized", False)
            user_score = user_data.get("userScore")

            d["startedAt"] = started_at
            d["finalized"] = finalized
            d["userScore"] = user_score
            # d["state"] = self._calculate_state(d, started_at, finalized)
            # now = datetime.now(timezone.utc)
            # deadline = datetime.fromisoformat(d["endTime"].replace("Z", "+00:00"))
            # if started_at:
            #     start_time = datetime.fromisoformat(started_at.replace("Z", "+00:00"))
            #     end_time = datetime.fromisoformat(d["endTime"].replace("Z", "+00:00"))
            #     expected_time = (end_time - start_time).total_seconds() / 60  # Expected time in minutes
            #     d["expectedTime"] = expected_time
            # elif now < deadline:
            #     expected_time = (deadline - now).total_seconds() / 60  # Expected time in minutes
            #     d["expectedTime"] = expected_time
            # else:
            #     d["expectedTime"] = 0

        return [Quiz(**d) for d in docs]

    def get_by_id(self, quiz_id: int, user_id: str) -> Optional[Quiz]:
        """Fetch a single practice with user-specific data."""
        raw = get_db()[COLLECTION].find_one({"id": quiz_id})
        if not raw:
            return None
        raw.pop("_id", None)

        # ✅ Auto finalize check
        self._auto_finalize_if_needed(quiz_id, user_id, raw["endTime"])

        user_data = get_db()[USER_COLLECTION].find_one(
            {"userId": user_id, "quizId": quiz_id}, {"_id": 0}
        ) or {}

        started_at = user_data.get("startedAt")
        finalized = user_data.get("finalized", False)
        user_score = user_data.get("userScore")

        raw["startedAt"] = started_at
        raw["finalized"] = finalized
        raw["userScore"] = user_score
        # raw["state"] = self._calculate_state(raw, started_at, finalized)
        # now = datetime.now(timezone.utc)
        # deadline = datetime.fromisoformat(raw["endTime"].replace("Z", "+00:00"))

        # if started_at:
        #     start_time = datetime.fromisoformat(started_at.replace("Z", "+00:00"))
        #     end_time = datetime.fromisoformat(raw["endTime"].replace("Z", "+00:00"))
        #     expected_time = (end_time - start_time).total_seconds() / 60  # Expected time in minutes
        #     raw["expectedTime"] = expected_time
        # elif now < deadline:
        #     expected_time = (deadline - now).total_seconds() / 60
        #     raw["expectedTime"] = expected_time
        # else:
        #     raw["expectedTime"] = 0
        return Quiz(**raw)

    def start_quiz(self, quiz_id: int, user_id: str) -> Optional[str]:
        """Start a practice (sets startedAt, but check auto-finalize first)."""
        quiz = get_db()[COLLECTION].find_one({"id": quiz_id})
        if not quiz:
            return None

        # ✅ Auto finalize check before starting
        if self._auto_finalize_if_needed(quiz_id, user_id, quiz["endTime"]):
            return None

        started_at = datetime.now(timezone.utc).isoformat()
        get_db()[USER_COLLECTION].update_one(
            {"userId": user_id, "quizId": quiz_id},
            {"$set": {"startedAt": started_at, "finalized": False}},
            upsert=True,
        )
        return started_at

    def finalize(self, quiz_id: int, user_id: str) -> bool:
        """Finalize a quiz for the user."""
        get_db()[USER_COLLECTION].update_one(
            {"userId": user_id, "quizId": quiz_id},
            {"$set": {"finalized": True}},
            upsert=True,
        )
        return True

    def get_questions_sheet_file(self, quiz_id: int) -> Optional[list]:
        """Get practice questions."""
        raw = get_db()["quiz_questions"].find_one({"quizId": quiz_id})
        if not raw:
            return None
        return {
            "file": raw["fileData"],  
            "fileName": raw.get("fileName", f"quizsheet_{quiz_id}.pdf")
        }

    def save_uploaded_answer(
        self, quiz_id: int, user_id: str, file_data: bytes, filename: str
    ):
        """Save or overwrite an answer for this user."""
        get_db()["quiz_answers"].update_one(
            {
                "quizId": quiz_id,
                "userId": user_id,
            },
            {
                "$set": {
                    "fileName": filename,
                    "fileData": Binary(file_data),
                    "uploadedAt": datetime.now(timezone.utc).isoformat(),
                }
            },
            upsert=True,
        )

    def get_answer_sheet_file(self, quiz_id: int) -> Optional[dict]:
        """Retrieve the official answer sheet file (binary)."""
        raw = get_db()["quiz_answer_sheets"].find_one({"quizId": quiz_id})
        if not raw:
            return None
        return {
            "file": raw["fileData"],  
            "fileName": raw.get("fileName", f"answersheet_{quiz_id}.pdf")
        }
