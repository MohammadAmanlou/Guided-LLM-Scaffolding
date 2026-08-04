import os
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_restx import Api
from dotenv import load_dotenv
from flask_cors import CORS

from app.config import app_config
from app.db import init_db
from app.routes import register_routes

def create_app(env: str | None = None) -> Flask:
    load_dotenv()

    env = env or os.getenv("FLASK_ENV", "dev")
    if env not in app_config:
        raise RuntimeError(f"Unknown FLASK_ENV '{env}', expected one of: {list(app_config)}")
    config_object = app_config[env]()
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object(config_object)
    app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024
    CORS(app, origins=["http://localhost:5173"])


    jwt = JWTManager(app)
    @jwt.unauthorized_loader
    def custom_unauthorized_response(callback):
        return jsonify({"message": "you are not authenticated"}), 401
    

    init_db()

    api = Api(
        app,
        version="0.1.0",
        title="Flaskerific API",
        doc="/api/docs" if env == "dev" else False
    )

    register_routes(api, app, root="api")
    
    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"status": "healthy"}), 200

    return app

