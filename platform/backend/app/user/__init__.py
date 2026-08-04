# app/user/__init__.py

from .model import User       # noqa
from .schema import UserSchema  # noqa

BASE_ROUTE = "users"

def register_routes(api, app, root="api"):
    from .controller import user_bp

    app.register_blueprint(user_bp, url_prefix=f"/{root}/{BASE_ROUTE}")
