from app.db import get_db

chats_col = get_db()["chats"]

class ChatHistory:
    @staticmethod
    def load(userId: str, practice_id: int) -> list:
        doc = get_db()["chats"].find_one({"userId": userId, "practice_id": practice_id})
        return doc.get("history", []) if doc else []

    @staticmethod
    def save(userId: str, practice_id: int, history: list):
        """
        Save the full message history for the user and specific practice.
        """
        get_db()["chats"].update_one(
            {"userId": userId, "practice_id": practice_id},
            {"$set": {"history": history}},
            upsert=True
        )

    @staticmethod
    def get_old_summary(userId: str, practice_id: int) -> str:
        """
        Retrieve the old summary for the user and specific practice.
        """
        doc = get_db()["chats"].find_one({"userId": userId, "practice_id": practice_id})
        return doc.get("old_summary", "") if doc else ""

    @staticmethod
    def set_old_summary(userId: str, practice_id: int, summary: str):
        """
        Update the old summary for the user and specific practice.
        """
        get_db()["chats"].update_one(
            {"userId": userId, "practice_id": practice_id},
            {"$set": {"old_summary": summary}},
            upsert=True
        )
