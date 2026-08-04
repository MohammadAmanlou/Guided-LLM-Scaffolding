from .model import Course  # noqa
from .schema import CourseSchema  # noqa

BASE_ROUTE = "course"


def register_routes(api, app, root="api"):
    from .controller import api as course_api

    api.add_namespace(course_api, path=f"/{root}/{BASE_ROUTE}")