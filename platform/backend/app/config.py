"""Application configuration loaded from environment variables."""

import os


def _required_secret(name: str, minimum_length: int = 32) -> str:
    value = os.getenv(name, "").strip()

    if not value:
        raise RuntimeError(
            f"{name} is not configured. Copy backend/.env.example to "
            "backend/.env and provide a secure value."
        )

    if len(value) < minimum_length:
        raise RuntimeError(
            f"{name} must contain at least {minimum_length} characters."
        )

    return value


def _positive_integer(name: str, default: int) -> int:
    raw_value = os.getenv(name, str(default))

    try:
        value = int(raw_value)
    except ValueError as error:
        raise RuntimeError(f"{name} must be an integer.") from error

    if value <= 0:
        raise RuntimeError(f"{name} must be greater than zero.")

    return value


class BaseConfig:
    JWT_TOKEN_LOCATION = "headers"
    JWT_HEADER_NAME = "authorization"
    JWT_HEADER_TYPE = "Bearer"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    def __init__(self):
        self.SECRET_KEY = _required_secret("SECRET_KEY")
        self.JWT_SECRET_KEY = _required_secret("JWT_SECRET_KEY")

        self.JWT_ACCESS_TOKEN_EXPIRES = _positive_integer(
            "JWT_ACCESS_TOKEN_EXPIRES",
            3600,
        )
        self.JWT_REFRESH_TOKEN_EXPIRES = _positive_integer(
            "JWT_REFRESH_TOKEN_EXPIRES",
            604800,
        )

        self.MONGO_DB_CONNECTION_STRING = os.getenv(
            "MONGO_DB_CONNECTION_STRING",
            "mongodb://localhost:27017",
        )
        self.DB_NAME = os.getenv("DB_NAME", "aied_db")


class DevConfig(BaseConfig):
    DEBUG = True
    FLASK_ENV = "dev"


class ProdConfig(BaseConfig):
    DEBUG = False
    FLASK_ENV = "prod"


app_config = {
    "dev": DevConfig,
    "prod": ProdConfig,
}
