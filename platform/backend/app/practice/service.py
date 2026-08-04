from ..db import get_db
from .model import Practice
from .interface import PracticeInterface
from typing import List, Optional
from datetime import datetime, timedelta, timezone
from bson import Binary
from io import BytesIO

COLLECTION = "practices"
USER_COLLECTION = "practice_users"




class PracticeService:
    
    def create(self, attrs: PracticeInterface) -> str:
        """Insert a new practice."""
        result = get_db()[COLLECTION].insert_one(attrs)
        return str(result.inserted_id)

    def _auto_finalize_if_needed(self, practice_id: int, user_id: str, end_time: str):
        """Automatically finalize if deadline has passed."""
        now = datetime.now(timezone.utc)
        deadline = datetime.fromisoformat(end_time.replace("Z", "+00:00"))

        user_data = get_db()[USER_COLLECTION].find_one(
            {"userId": user_id, "practiceId": practice_id}, {"_id": 0}
        )

        if now > deadline and not user_data:
            get_db()[USER_COLLECTION].update_one(
                {"userId": user_id, "practiceId": practice_id},
                {"$set": {"finalized": True}},
                upsert=True,
            )
            return True
        return False
    

    def get_all(self, user_id: str) -> List[Practice]:
        """Fetch all practices, add user-specific data + auto-finalize if needed."""
        docs = list(get_db()[COLLECTION].find({}))
        for d in docs:
            d.pop("_id", None)

            user_data = get_db()[USER_COLLECTION].find_one(
                {"userId": user_id, "practiceId": d["id"]}, {"_id": 0}
            ) or {}

            # ✅ Auto finalize check
            self._auto_finalize_if_needed(d["id"], user_id, d["endTime"])
            user_data = get_db()[USER_COLLECTION].find_one(
                {"userId": user_id, "practiceId": d["id"]}, {"_id": 0}
            ) or {}

            started_at = user_data.get("startedAt")
            finalized = user_data.get("finalized", False)
            user_score = user_data.get("userScore")

            d["startedAt"] = started_at
            d["finalized"] = finalized
            d["userScore"] = user_score
            # d["state"] = self._calculate_state(d, started_at, finalized)

            now = datetime.now(timezone.utc)
            deadline = datetime.fromisoformat(d["endTime"].replace("Z", "+00:00"))
            if started_at:
                start_time = datetime.fromisoformat(started_at.replace("Z", "+00:00"))
                end_time = datetime.fromisoformat(d["endTime"].replace("Z", "+00:00"))
                expected_time = (end_time - start_time).total_seconds() / 60  # Expected time in minutes
                d["expectedTime"] = expected_time
            elif now < deadline:
                expected_time = (deadline - now).total_seconds() / 60  # Expected time in minutes
                d["expectedTime"] = expected_time
            else:
                d["expectedTime"] = 0

        return [Practice(**d) for d in docs]

    def get_by_id(self, practice_id: int, user_id: str) -> Optional[Practice]:
        """Fetch a single practice with user-specific data."""
        raw = get_db()[COLLECTION].find_one({"id": practice_id})
        if not raw:
            return None
        raw.pop("_id", None)

        # ✅ Auto finalize check
        self._auto_finalize_if_needed(practice_id, user_id, raw["endTime"])

        user_data = get_db()[USER_COLLECTION].find_one(
            {"userId": user_id, "practiceId": practice_id}, {"_id": 0}
        ) or {}

        started_at = user_data.get("startedAt")
        finalized = user_data.get("finalized", False)
        user_score = user_data.get("userScore")

        raw["startedAt"] = started_at
        raw["finalized"] = finalized
        raw["userScore"] = user_score
        # raw["state"] = self._calculate_state(raw, started_at, finalized)
        now = datetime.now(timezone.utc)
        deadline = datetime.fromisoformat(raw["endTime"].replace("Z", "+00:00"))

        if started_at:
            start_time = datetime.fromisoformat(started_at.replace("Z", "+00:00"))
            end_time = datetime.fromisoformat(raw["endTime"].replace("Z", "+00:00"))
            expected_time = (end_time - start_time).total_seconds() / 60  # Expected time in minutes
            raw["expectedTime"] = expected_time
        elif now < deadline:
            expected_time = (deadline - now).total_seconds() / 60
            raw["expectedTime"] = expected_time
        else:
            raw["expectedTime"] = 0
        return Practice(**raw)

    def start_practice(self, practice_id: int, user_id: str) -> Optional[str]:
        """Start a practice (sets startedAt, but check auto-finalize first)."""
        practice = get_db()[COLLECTION].find_one({"id": practice_id})
        if not practice:
            return None

        # ✅ Auto finalize check before starting
        if self._auto_finalize_if_needed(practice_id, user_id, practice["endTime"]):
            return None

        started_at = datetime.now(timezone.utc).isoformat()
        get_db()[USER_COLLECTION].update_one(
            {"userId": user_id, "practiceId": practice_id},
            {"$set": {"startedAt": started_at, "finalized": False}},
            upsert=True,
        )
        return started_at

    def finalize(self, practice_id: int, user_id: str) -> bool:
        """Finalize a practice for the user."""
        get_db()[USER_COLLECTION].update_one(
            {"userId": user_id, "practiceId": practice_id},
            {"$set": {"finalized": True}},
            upsert=True,
        )
        return True

    def get_questions(self, practice_id: int) -> Optional[list]:
        """Get practice questions."""
        raw = get_db()[COLLECTION].find_one({"id": practice_id})
        if not raw or "questions" not in raw:
            return None
        return raw["questions"]

    def save_uploaded_answer(
        self, practice_id: int, question_id: int, user_id: str, file_data: bytes, filename: str
    ):
        """Save or overwrite an answer for this user."""
        get_db()["answers"].update_one(
            {
                "practiceId": practice_id,
                "questionId": question_id,
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

    def get_answer_sheet_file(self, practice_id: int) -> Optional[dict]:
        """Retrieve the official answer sheet file (binary)."""
        raw = get_db()["answer_sheets"].find_one({"practiceId": practice_id})
        if not raw:
            return None
        return {
            "file": raw["fileData"],  
            "fileName": raw.get("fileName", f"answersheet_{practice_id}.pdf")
        }

    def get_score(self, practice_id: int, user_id: str) -> Optional[dict]:
        """Get user score (auto finalize if needed)."""
        practice = get_db()[COLLECTION].find_one({"id": practice_id})
        if practice:
            self._auto_finalize_if_needed(practice_id, user_id, practice["endTime"])

        user_data = get_db()[USER_COLLECTION].find_one(
            {"userId": user_id, "practiceId": practice_id}, {"_id": 0}
        )
        if not user_data or "userScore" not in user_data:
            return None
        return {
            "practiceId": practice_id,
            "userId": user_id,
            "score": user_data.get("userScore"),
        }

    def _calculate_state(self, practice: dict, started_at: Optional[str], finalized: bool) -> str:
        """Calculate user-specific state."""
        now = datetime.now(timezone.utc)
        start_time = datetime.fromisoformat(practice["startTime"].replace("Z", "+00:00"))
        end_time = datetime.fromisoformat(practice["endTime"].replace("Z", "+00:00"))
        started_dt = datetime.fromisoformat(started_at) if started_at else None
        expected_end = (
            started_dt + timedelta(minutes=practice.get("expectedTime", 0))
            if started_dt
            else None
        )

        if now < start_time:
            return "NOT_STARTED_YET"
        if finalized or now > end_time:
            return "TIME_OVER"
        if not started_dt:
            return "READY_TO_START"
        if expected_end and now < expected_end:
            return "IN_PROGRESS"
        return "ATTENDED"
    def can_access_llm(self, practice_id: int, user_id: str) -> bool:
        """Check if the user can access LLM:
        - User must have started the practice
        - Time must be within start and end time
        - Practice must not be finalized
        """
        practice = get_db()[COLLECTION].find_one({"id": practice_id})
        if not practice:
            return False

        user_data = get_db()[USER_COLLECTION].find_one(
            {"userId": user_id, "practiceId": practice_id},
            {"_id": 0, "startedAt": 1, "finalized": 1}
        ) or {}

        started_at = user_data.get("startedAt")
        finalized = user_data.get("finalized", False)

        if not started_at:
            return False

        now = datetime.now(timezone.utc)
        try:
            start_time = datetime.fromisoformat(practice["startTime"].replace("Z", "+00:00"))
            end_time = datetime.fromisoformat(practice["endTime"].replace("Z", "+00:00"))
        except (KeyError, ValueError):
            return False

        if not (start_time <= now <= end_time):
            return False

        if finalized:
            return False

        return True
