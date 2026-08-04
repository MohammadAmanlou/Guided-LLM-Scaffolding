from functools import wraps
from flask_jwt_extended import get_jwt_identity, jwt_required, get_jwt
from flask import jsonify
from ..db import get_db  # Assuming get_db provides access to your MongoDB or database

def permissions_required(*required_permissions):
    """
    This decorator checks if the user has all of the required permissions
    to access a specific route. It ensures the token is in the request
    and verifies the permissions.
    """
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            try:
                # Get the username from the JWT token
                username = get_jwt_identity()  

                # This should return the decoded identity (i.e., the username)
                if not username:
                    return jsonify({"msg": f"You are not authenticated {username}"}), 401

                # Option 1: Get the user's permissions directly from the JWT (if included during token generation)
                current_permissions = get_jwt().get('permissions', [])

                # Option 2: Optionally, fetch permissions from the database if not available in JWT
                if not current_permissions:
                    user_data = get_db()["users"].find_one({"username": username})
                    if not user_data:
                        return jsonify({"msg": "User not found"}), 404
                    current_permissions = user_data.get("permissions", [])

            except Exception as e:
                return jsonify({"msg": "Error in extracting permissions", "error": str(e)}), 400

            # Check if the user has all of the required permissions
            if not all(permission in current_permissions for permission in required_permissions):
                return jsonify({"msg": "You do not have the necessary permissions to access this resource."}), 403
            
            return fn(*args, **kwargs)
        
        return wrapper
    return decorator
