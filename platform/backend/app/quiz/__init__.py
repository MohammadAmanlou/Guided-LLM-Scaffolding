BASE_ROUTE = "quizzes"

def register_routes(api, app, root="api"):
    from .controller import quizzes_bp
    app.register_blueprint(quizzes_bp, url_prefix=f"/{root}/{BASE_ROUTE}")
