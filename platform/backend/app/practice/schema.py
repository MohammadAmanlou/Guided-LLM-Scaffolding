from marshmallow import Schema, fields

class QuestionSchema(Schema):
    id = fields.Int(required=True)
    imageUrl = fields.Str(required=True)

class PracticeSchema(Schema):
    id = fields.Int(required=True)
    name = fields.Str(required=True)
    startTime = fields.Str(required=True)
    endTime = fields.Str(required=True)
    expectedTime = fields.Int(required=True)
    totalScore = fields.Int(required=True)
    userScore = fields.Int(allow_none=True)
    startedAt = fields.Str(allow_none=True)
    finalized = fields.Bool()
    questions = fields.List(fields.Nested(QuestionSchema))
    state = fields.Str(required=True)
