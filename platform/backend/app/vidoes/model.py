from flask_restx import fields

def get_video_models(api):
    video_item_model = api.model('VideoItem', {
        'id': fields.Integer(required=True, description='شناسه ویدیو'),
        'number': fields.Integer(required=True, description='شماره ترتیب ویدیو'),
        'title': fields.String(required=True, description='عنوان ویدیو'),
        'thumbnail': fields.String(required=True, description='آدرس تصویر بندانگشتی'),
        'summary': fields.String(required=True, description='خلاصه ویدیو'),
        'duration': fields.String(required=True, description='مدت زمان ویدیو (مثلاً 2:36)'),
        'start time': fields.String(required=True, description='زمان شروع انتشار ویدیو (مثلاً 2025/01/24)'),
        'accessible': fields.Boolean(required=True, description='آیا ویدیو قابل دسترس است؟')
    })

    video_list_model = api.model('VideoList', {
        'videos': fields.List(fields.Nested(video_item_model), description='لیست ویدیوها')
    })

    access_model = api.model('AccessCheck', {
        "allowed": fields.Boolean
    })

    video_detail_model = api.model('VideoDetail', {
        'title': fields.String(required=True, description='عنوان ویدیو'),
        'description': fields.String(required=True, description='توضیحات کامل ویدیو'),
        'embedUrl': fields.String(required=True, description='آدرس URL جاسازی شده ویدیو'),
        'thumbnail': fields.String(required=True, description='تصویر بندانگشتی'),
        'duration': fields.String(required=True, description='مدت زمان پخش ویدیو')
    })

    return video_item_model, video_list_model, access_model, video_detail_model
