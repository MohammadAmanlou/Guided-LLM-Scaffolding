BASE_ROUTE = "vidoe"


def register_routes(api, app, root="api"):
    from .controller import api as auth_api

    api.add_namespace(auth_api, path=f"/{root}/{BASE_ROUTE}")