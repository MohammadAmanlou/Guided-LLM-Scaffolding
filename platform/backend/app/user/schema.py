# app/user/schema.py

from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    _id = fields.Str(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(min=1))
    password = fields.Str(
        required=True,
        load_only=True,
        validate=validate.Length(min=6)
    )
    role = fields.Str(
        required=True,
        validate=validate.OneOf(
            ["admin", "student_chat", "student_plain"]
        )
    )
