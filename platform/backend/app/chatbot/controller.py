from flask import Blueprint, request, jsonify
from .service import ChatService
from .model import ChatHistory  # اگر تاریخچه اینجا ذخیره می‌شه
from app.db import get_db
from app.practice.service import PracticeService

#TODO: move handling response to service

COLLECTION = "practices"
USER_COLLECTION = "practice_users"

chatbot_api = Blueprint("chatbot", __name__)
_service = ChatService()

@chatbot_api.route("/access", methods=["POST"])
def chat_access():

    data = request.get_json(silent=True) or {}
    userId = data.get("userId")

    body, status = _service.check_access(userId)
    return jsonify(body), status

@chatbot_api.route("/history", methods=["POST"])
def chat_history():
    data = request.get_json()
    user_id = data.get("userId")

    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    active_practice_id = None
    user_practices = get_db()[USER_COLLECTION].find({"userId": user_id})

    for practice in user_practices:
        if PracticeService().can_access_llm(practice.get("practiceId"), user_id):
            active_practice_id = practice["practiceId"]
            break

    if not active_practice_id:
        return jsonify({"error": "No active practice found"}), 400

    history = ChatHistory.load(user_id, active_practice_id)

    limit = data.get("limit")
    offset = data.get("offset")

    if limit and offset:
        start_index = max(0, len(history) - offset - limit)
        history = history[start_index:len(history) - offset]

    elif limit:
        start_index = max(0, len(history) - limit)
        history = history[start_index:]
        
    return jsonify({"messages": history}), 200

@chatbot_api.route("/send", methods=["POST"])
def chat_send():
    if request.content_type.startswith("multipart/form-data"):
        userId = request.form.get("userId")
        message = request.form.get("message")
    else:
        data = request.get_json()
        userId = data.get("userId")
        message = data.get("message")

    if not userId:
        return jsonify({"error": "Missing userId"}), 400

    if not message:
        return jsonify({"error": "Missing message"}), 400

    active_practice_id = None
    user_practices = get_db()[USER_COLLECTION].find({"userId": userId})

    for practice in user_practices:
        if PracticeService().can_access_llm(practice.get("practiceId"), userId):
            active_practice_id = practice["practiceId"]
            break

    if not active_practice_id:
        return jsonify({"error": "No active practice found"}), 400

    history = ChatHistory.load(userId, active_practice_id)
    history.append({"role": "user", "content": message})

    reply = _service.process_message(userId,active_practice_id, message)

    history.append({"role": "assistant", "content": reply})
    ChatHistory.save(userId, active_practice_id, history)

    return jsonify({"reply": reply}), 200
