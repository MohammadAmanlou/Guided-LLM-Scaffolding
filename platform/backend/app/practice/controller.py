from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from .service import PracticeService
from .schema import PracticeSchema
from flask import send_file
import io
from app.utils import permissions_required

practice_bp = Blueprint("practices", __name__)
_service = PracticeService()
_schema = PracticeSchema()
_list_schema = PracticeSchema(many=True)

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB


@practice_bp.route("/<int:practice_id>/answersheet", methods=["GET"])


def get_answer_sheet(practice_id):
    sheet = _service.get_answer_sheet_file(practice_id)
    if not sheet:
        return {"msg": "Answer sheet not found"}, 404

    return send_file(
        io.BytesIO(sheet["file"]),
        as_attachment=True,
        download_name=sheet["fileName"],
        mimetype="application/pdf"  
    )


@practice_bp.route("/", methods=["POST"])
def list_practices():
    user_id = request.json.get("userId")
    if not user_id:
        return {"msg": "Missing userId"}, 400
    practices = _service.get_all(user_id)
    return jsonify(_list_schema.dump([p.to_dict() for p in practices]))


@practice_bp.route("/<int:practice_id>", methods=["POST"])
# @permissions_required('video')  example
def get_practice(practice_id):
    user_id = request.json.get("userId")
    if not user_id:
        return {"msg": "Missing userId"}, 400
    practice = _service.get_by_id(practice_id, user_id)
    if not practice:
        return {"msg": "Practice not found"}, 404
    return jsonify(_schema.dump(practice.to_dict()))


@practice_bp.route("/<int:practice_id>/start", methods=["POST"])
def start_practice(practice_id):
    user_id = request.json.get("userId")
    if not user_id:
        return {"msg": "Missing userId"}, 400
    started_at = _service.start_practice(practice_id, user_id)
    if not started_at:
        return {"msg": "Cannot start. Practice already finalized or expired."}, 400
    return jsonify({"startedAt": started_at})


@practice_bp.route("/<int:practice_id>/finalize", methods=["POST"])
def finalize_practice(practice_id):
    user_id = request.form.get("userId") or request.json.get("userId")
    if not user_id:
        return {"msg": "Missing userId"}, 400

    #if request.files:
     #   for key, file in request.files.items():
     #       if not file:
      #          continue
       #     question_id = key.replace("question_", "")
        #    filename = secure_filename(f"{user_id}_{practice_id}_{question_id}_{file.filename}")
         #   file_data = file.read()
          #  _service.save_uploaded_answer(practice_id, int(question_id), user_id, file_data, filename)

    success = _service.finalize(practice_id, user_id)
    return jsonify({"success": success})


@practice_bp.route("/<int:practice_id>/questions", methods=["POST"])
def get_practice_questions(practice_id):
    questions = _service.get_questions(practice_id)
    if not questions:
        return {"msg": "No questions found for this practice"}, 404
    return jsonify({"questions": questions})


@practice_bp.route("/<int:practice_id>/upload", methods=["POST"])
def upload_answer(practice_id):
    file = request.files.get("file")
    question_id = request.form.get("questionId")
    user_id = request.form.get("userId")

    if not file or not question_id or not user_id:
        return {"msg": "Missing file, questionId, or userId"}, 400

    if file and len(file.read()) > MAX_FILE_SIZE:
        return {"msg": "File size exceeds the maximum limit of 20 MB"}, 400

    file.seek(0)
    filename = secure_filename(f"{user_id}_{practice_id}_{question_id}_{file.filename}")
    file_data = file.read()

    _service.save_uploaded_answer(practice_id, int(question_id), user_id, file_data, filename)
    return jsonify({"success": True})


@practice_bp.route("/<int:practice_id>/answersheet", methods=["GET"])
def get_answer_sheet_url(practice_id):
    url = _service.get_answer_sheet_url(practice_id)
    if not url:
        return {"msg": "Answer sheet URL not found"}, 404
    return jsonify({"answerSheetUrl": url})


@practice_bp.route("/<int:practice_id>/score", methods=["POST"])
def get_user_score(practice_id):
    user_id = request.json.get("userId")
    if not user_id:
        return {"msg": "Missing userId"}, 400
    score_data = _service.get_score(practice_id, user_id)
    if not score_data:
        return {"msg": "Score not found for this user"}, 404
    return jsonify(score_data)
