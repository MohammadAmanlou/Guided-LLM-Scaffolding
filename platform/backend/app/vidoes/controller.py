from flask_restx import Namespace, Resource, fields
from flask import request
from .model import get_video_models
from app.vidoes.service import (
    get_all_videos,
    get_video_by_id,
    is_video_access_allowed
)

api = Namespace('videos', description='Video related operations')
video_item_model, video_list_model, access_model, video_detail_model = get_video_models(api)





@api.route('/')
class VideoList(Resource):
    @api.doc('get_all_videos')
    @api.response(200, 'Videos retrieved successfully')
    @api.marshal_list_with(video_list_model)
    def get(self):
        return get_all_videos(), 200


@api.route('/<int:video_id>')
@api.param('video_id', 'The video identifier')
class VideoDetail(Resource):
    @api.doc('get_video_by_id')
    @api.response(200, 'Video found', video_detail_model)
    @api.response(404, 'Video not found')
    def get(self, video_id):
        video = get_video_by_id(video_id)
        if video:
            return video, 200
        return {"error": "ویدیو پیدا نشد"}, 404


@api.route('/access')
class VideoAccessCheck(Resource):
    @api.doc('check_video_access')
    @api.response(200, 'Access check result', access_model)
    def get(self):
        return is_video_access_allowed(), 200
