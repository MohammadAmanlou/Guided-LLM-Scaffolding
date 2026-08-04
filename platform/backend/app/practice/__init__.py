from .model import Practice        # noqa
from .schema import PracticeSchema  # noqa

BASE_ROUTE = "practices"

def register_routes(api, app, root="api"):
    from .controller import practice_bp
    app.register_blueprint(practice_bp, url_prefix=f"/{root}/{BASE_ROUTE}")
