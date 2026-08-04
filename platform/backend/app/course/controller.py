from flask import request,jsonify
from flask_accepts import accepts, responds
from flask_restx import Namespace, Resource
from flask.wrappers import Response
from typing import List
from .service import CourseService
from .schema import  CourseSchema, UpsertCourseSchema
from .model import Course
from flask_jwt_extended import jwt_required
from app.utils import permissions_required

api = Namespace("Course", description="Single namespace, single entity")  # noqa

@api.route("/")
@permissions_required('base-student')
class CourseResource(Resource):
    """Courses"""

    def get(self) -> List[Course]:
        """Get all Courses"""
        course_service = CourseService()
        data=course_service.get_all()
        serialized = CourseSchema(many=True).dump(data)
        print(serialized)
        return jsonify( {
        "data": serialized,
        "message": "Courses fetched successfully"
        })

    @accepts(schema=UpsertCourseSchema, api=api)
    def post(self) -> Course:
        """Create a Single Course"""
        course_service = CourseService()
        res=course_service.create(request.parsed_obj)
        return jsonify({
            "data": res,
            "message":"success"
        })


@api.route("/<string:courseId>")
@api.param("courseId", "Course database ID")
class CourseIdResource(Resource):
    @responds(schema=CourseSchema)
    def get(self, courseId: str) -> Course:
        """Get Single Course"""
        course_service = CourseService()
        data = course_service.get_by_id(courseId)
        serialized = CourseSchema(many=False).dump(data)
        return jsonify({"data":serialized})

    def delete(self, courseId: str) -> Response:
        """Delete Single Course"""
        from flask import jsonify
        course_service = CourseService()
        id = course_service.delete_by_id(courseId)
        return jsonify({"message":"success" if id else "not_found","data":id})

    @accepts(schema=UpsertCourseSchema, api=api)
    @responds(schema=CourseSchema)
    def put(self, courseId: str) -> Course:
        """Update Single Course"""
        course_service = CourseService()
        changes: CourseService = request.parsed_obj
        course = course_service.get_by_id(courseId)
        return course_service.update(course, changes)