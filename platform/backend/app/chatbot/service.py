from .model import ChatHistory
from .openai_client import client, OPENAI_SUMMARY_MODEL, OPENAI_MODEL
from .utils import format_history
from app.db import get_db
from typing import Tuple, Dict


COLLECTION = "practices"
USER_COLLECTION = "practice_users"

from .model import ChatHistory
from .openai_client import client, OPENAI_SUMMARY_MODEL, OPENAI_MODEL, OPENAI_EMBEDDING_MODEL
from .utils import format_history
import chromadb
import uuid
from datetime import datetime, timedelta, timezone
from app.practice.service import PracticeService

embedding_client = chromadb.PersistentClient(path="./chroma_db")
collection = embedding_client.get_or_create_collection(name="chatEmbeddings")

class ChatService:
    def process_message(self, user_id: str, practice_id: str, message: str) -> str:
        history = ChatHistory.load(user_id, practice_id)

        # Retrieve related contexts based on embeddings
        similar_contexts = self.find_k_nearest_embeddings(user_id, practice_id, message, k=5)

        # Build the messages for the model
        messages = [{"role": "system", "content": f"Related context {i+1}: {ctx}"} for i, ctx in enumerate(similar_contexts)]

        if len(history) >= 2:
            messages.append({"role": "system", "content": f"former message:\n question: {history[-2]}\nyour answer: {history[-1]}"})
        messages.append({"role": "user", "content": message})

        # Get model response
        reply = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages
        ).choices[0].message.content.strip()

        # Save chat to history
        history.append({"role": "user", "content": message})
        history.append({"role": "assistant", "content": reply})
        ChatHistory.save(user_id, practice_id, history)

        # Combine Q&A for embedding
        combined_text = f"Q: {message}\nA: {reply}"

        # Summarize long conversations
        if len(combined_text) > 150:
            summary_prompt = [
                {"role": "system", "content": "You are a summarizer that condenses long conversations into a short and helpful summary. Keep it under 50 tokens."},
                {"role": "user", "content": f"Summarize this conversation:\n{combined_text}"}
            ]
            summarized = client.chat.completions.create(
                model=OPENAI_SUMMARY_MODEL,
                messages=summary_prompt,
                max_tokens=80
            ).choices[0].message.content.strip()
            combined_text = summarized

        # Store the summarized embedding with user_id and practice_id
        self.store_embedding(user_id=user_id, practice_id=practice_id, text=combined_text)

        return reply

    def get_embedding(self, text: str) -> list[float]:
        embedding = client.embeddings.create(
            input=text,
            model=OPENAI_EMBEDDING_MODEL
        ).data[0].embedding
        return embedding

    def store_embedding(self, user_id: str, practice_id: str, text: str):
        embedding = self.get_embedding(text)
        metadata = {
            "user_id": user_id,
            "practice_id": practice_id
        }
        collection.add(
            embeddings=[embedding],
            documents=[text],
            metadatas=[metadata],
            ids=[f"{user_id}_{str(uuid.uuid4())}"]
        )

    def find_k_nearest_embeddings(self, user_id: str, practice_id: str, query: str, k: int = 5) -> list[str]:
        query_embedding = self.get_embedding(query)
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=k,
            where={  "$and": [{"user_id": user_id},{"practice_id": practice_id}]}
        )
        return results["documents"][0]
	    
    # def summarize(self, history: list, num_bullet_points) -> str:
    #     system_prompt = (
    #         "You are a professional conversation summarizer. "
    #         "Extract key points, decisions, and questions from the chat history."
    #     )
    #     user_prompt = (
    #         f"Please provide a short summary (maximum {num_bullet_points} bullet points) of the following conversation:\n\n"
    #         f"{format_history(history)}"
    #     )
    #     resp = client.chat.completions.create(
    #         model=OPENAI_SUMMARY_MODEL,
    #         messages=[
    #             {"role": "system", "content": system_prompt},
    #             {"role": "user",   "content": user_prompt}
    #         ],
    #         temperature=0.0,
    #         max_tokens=50
    #     )
    #     return resp.choices[0].message.content.strip()
    

    def check_access(self, user_id: str) -> Tuple[Dict, int]:
        if not user_id:
            return {"allowed": False, "error": "Missing userId"}, 400

        users_col = get_db()["users"]
        user = users_col.find_one({"username": user_id})
        if not user:
            return {"allowed": False, "error": "User not found"}, 404

        if 'LLM' not in user.get("permissions", []):
            return {"allowed": False, "error": "Insufficient role"}, 200

        user_practices = get_db()[USER_COLLECTION].find({"userId": user_id})

        active_practice_found = False
        # now = datetime.now(timezone.utc)
        for practice in user_practices:
            # deadline = datetime.fromisoformat(practice["endTime"].replace("Z", "+00:00"))
            if  PracticeService().can_access_llm(practice["practiceId"], user_id):
                active_practice_found = True
                break

        if not active_practice_found:
            return {"allowed": False, "error": "Practice inactive"}, 200

        return {"allowed": True}, 200
