import json
from datetime import datetime
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VIDEO_JSON_PATH = os.path.join(BASE_DIR, 'data/vidoes.json')
VIDEO_INFO_PATH = os.path.join(BASE_DIR, 'data/vidoes_info.json')


def get_all_videos():

    with open(VIDEO_JSON_PATH, 'r', encoding='utf-8') as f:
        videos = json.load(f)
    today = datetime.today().date()
    print(videos)
    for index, video in enumerate(videos):
        start_time_str = video.get("start time")
        if start_time_str:
            try:
                start_date = datetime.strptime(start_time_str, "%Y/%m/%d").date()
            except ValueError:
                start_date = None
        else:
            start_date = None
        video["accessible"] = start_date is not None and today >= start_date
    print(videos)
    return {"videos": videos}


def get_video_by_id(video_id):
    with open(VIDEO_INFO_PATH, 'r', encoding='utf-8') as f:
        videos = json.load(f)

    video_key = str(video_id)
    return videos.get(video_key)


def is_video_access_allowed():
    return {"allowed": True}
