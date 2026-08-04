from marshmallow import fields, Schema


class CourseSchema(Schema):
    """Course schema"""

    courseId = fields.String(attribute="course_id")
    name = fields.String(attribute="name")
    purpose = fields.String(attribute="purpose")
class UpsertCourseSchema(Schema):
    
    "UpsertCourseSchema schema"
    
    name = fields.String(attribute="name")
    purpose = fields.String(attribute="purpose")