# app/user/controller.py

from flask import Blueprint, request, jsonify
from .service import UserService
from .schema import UserSchema

user_bp = Blueprint("users", __name__)
_service   = UserService()
_schema    = UserSchema()
_list_schema = UserSchema(many=True)

@user_bp.route("/", methods=["POST"])
def create_user_route():
    payload = request.get_json()
    new_id = _service.create(payload)
    user   = _service.get_by_id(new_id)
    return jsonify(_schema.dump(user.to_dict())), 201

@user_bp.route("/", methods=["GET"])
def list_users_route():
    users = _service.get_all()
    return jsonify(_list_schema.dump([u.to_dict() for u in users]))

@user_bp.route("/<uid>", methods=["GET"])
def get_user_route(uid):
    user = _service.get_by_id(uid)
    if not user:
        return {"msg": "Not found"}, 404
    return jsonify(_schema.dump(user.to_dict()))

@user_bp.route("/by-username/<username>", methods=["GET"])
def get_by_username_route(username):
    user = _service.get_by_username(username)
    if not user:
        return {"msg": "Not found"}, 404
    return jsonify(_schema.dump(user.to_dict()))

@user_bp.route("/<uid>", methods=["PATCH"])
def update_user_route(uid):
    user = _service.get_by_id(uid)
    if not user:
        return {"msg": "Not found"}, 404
    changes = request.get_json()
    updated = _service.update(user, changes)
    return jsonify(_schema.dump(updated.to_dict()))

@user_bp.route("/<uid>", methods=["DELETE"])
def delete_user_route(uid):
    success = _service.delete_by_id(uid)
    if not success:
        return {"msg": "Not found"}, 404
    return "", 204
