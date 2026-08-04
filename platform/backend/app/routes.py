def register_routes(api, app, root="api"):
    from app.practice import register_routes as register_practice_routes
    from app.vidoes import register_routes as attach_vidoes
    from app.quiz import register_routes as register_quiz_routes
    from app.auth import register_routes as register_auth
    from app.chatbot import register_routes as register_chatbot

    register_practice_routes(api, app, root)
    attach_vidoes(api, app)

    register_quiz_routes(api, app, root)
    register_auth(api, app, root)
    register_chatbot(api, app, root)
