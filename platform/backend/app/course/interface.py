from mypy_extensions import TypedDict


class CourseInterface(TypedDict, total=False):
    course_id: str
    name: str
    purpose: str
    