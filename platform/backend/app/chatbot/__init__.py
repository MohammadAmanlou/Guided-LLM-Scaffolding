BASE_ROUTE = "chatbot"

def register_routes(api, app, root="api"):
    from .controller import chatbot_api
    app.register_blueprint(chatbot_api, url_prefix=f"/{root}/{BASE_ROUTE}")
