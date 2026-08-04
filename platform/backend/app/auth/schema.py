from marshmallow import fields, Schema, validate

class LoginSchema(Schema):
    """Login schema"""
    username = fields.Str(attribute="username", required=True)
    password = fields.Str(attribute="password", required=True)

class RefreshTokenSchema(Schema):
    """RefreshToken schema"""
    refresh_token = fields.Str(required=True)

class RegisterUserSchema(Schema):
    """RegisterUser schema"""
    username = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    password = fields.Str(required=True, validate=validate.Length(min=8, max=128))
    first_name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    last_name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    role = fields.Str(required=True, validate=validate.OneOf([ "restricted-student", "normal-student"]))

class ChangePasswordSchema(Schema):
    """Schema to validate password change request"""
    username = fields.Str(required=True)
    old_password = fields.Str(required=True)
    new_password = fields.Str(required=True, validate=validate.Length(min=8, max=128))
