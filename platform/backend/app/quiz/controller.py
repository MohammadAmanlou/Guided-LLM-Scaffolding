from flask import Blueprint, jsonify, request
from .service import QuizService
from .schema import QuizSchema
from flask import Blueprint, request, jsonify
from flask import send_file
import io
from app.utils import permissions_required
from werkzeug.utils import secure_filename


quizzes_bp = Blueprint('quizzes_api', __name__)
service = QuizService()
quiz_schema = QuizSchema()
quiz_list_schema = QuizSchema(many=True)

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB


@quizzes_bp.route("/<int:quiz_id>/answersheet", methods=["GET"])
def get_answer_sheet(quiz_id):
    sheet = service.get_answer_sheet_file(quiz_id)
    if not sheet:
        return {"msg": "Answer sheet not found"}, 404

    return send_file(
        io.BytesIO(sheet["file"]),
        as_attachment=True,
        download_name=sheet["fileName"],
        mimetype="application/pdf"  
    )


@quizzes_bp.route("/", methods=["POST"])
def list_quizzes():
    user_id = request.json.get("userId")
    if not user_id:
        return {"msg": "Missing userId"}, 400
    quizzes = service.get_all(user_id)
    return jsonify(quiz_list_schema.dump([q.to_dict() for q in quizzes]))


@quizzes_bp.route("/<int:quiz_id>", methods=["POST"])
# @permissions_required('video')  example
def get_quiz(quiz_id):
    user_id = request.json.get("userId")
    if not user_id:
        return {"msg": "Missing userId"}, 400
    quiz = service.get_by_id(quiz_id, user_id)
    if not quiz:
        return {"msg": "Quiz not found"}, 404
    return jsonify(quiz_schema.dump(quiz.to_dict()))


@quizzes_bp.route("/<int:quiz_id>/start", methods=["POST"])
def start_quiz(quiz_id):
    user_id = request.json.get("userId")
    if not user_id:
        return {"msg": "Missing userId"}, 400
    started_at = service.start_quiz(quiz_id, user_id)
    if not started_at:
        return {"msg": "Cannot start. Quiz already finalized or expired."}, 400
    return jsonify({"startedAt": started_at})


@quizzes_bp.route("/<int:quiz_id>/finalize", methods=["POST"])
def finalize_quiz(quiz_id):
    user_id = request.form.get("userId") or request.json.get("userId")
    if not user_id:
        return {"msg": "Missing userId"}, 400

    # if request.files:
    #     for key, file in request.files.items():
    #         if not file:
    #             continue
    #         question_id = key.replace("question_", "")
    #         filename = secure_filename(f"{user_id}_{quiz_id}_{question_id}_{file.filename}")
    #         file_data = file.read()
    #         service.save_uploaded_answer(quiz_id, int(question_id), user_id, file_data, filename)

    success = service.finalize(quiz_id, user_id)
    return jsonify({"success": success})


@quizzes_bp.route("/<int:quiz_id>/questions", methods=["GET"])
def get_quiz_questions(quiz_id):
    sheet = service.get_questions_sheet_file(quiz_id)
    if not sheet:
        return {"msg": "Quiz Questions not found"}, 404

    return send_file(
        io.BytesIO(sheet["file"]),
        as_attachment=True,
        download_name=sheet["fileName"],
        mimetype="application/pdf"  
    )


@quizzes_bp.route("/<int:quiz_id>/upload", methods=["POST"])
def upload_answer(quiz_id):
    file = request.files.get("file")
    user_id = request.form.get("userId")

    if not file  or not user_id:
        return {"msg": "Missing file or userId"}, 400
    
    if file and len(file.read()) > MAX_FILE_SIZE:
        return {"msg": "File size exceeds the maximum limit of 20 MB"}, 400

    file.seek(0)
    filename = secure_filename(f"{user_id}_{quiz_id}_{file.filename}")
    file_data = file.read()

    service.save_uploaded_answer(quiz_id, user_id, file_data, filename)
    return jsonify({"success": True})



