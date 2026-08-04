from typing import List
from .model import Course
from .interface import CourseInterface
from ..db import get_db
from bson import ObjectId



class CourseService:
    
    def create(self,new_attrs: CourseInterface) -> str:
        res = get_db()["course"].insert_one(new_attrs)
        return str(res.inserted_id)
    
    def update(self,course : Course, changes: CourseInterface):
        for key, val in changes.items():
            setattr(course, key, val)
        res=get_db()["course"].replace_one({"_id": course.course_id}, course.to_dict(), upsert=True)
        return course

    def get_all(self) -> List[Course]:
        documents = get_db()["course"].find()
        return [Course(doc["_id"], doc["name"], doc["purpose"]) for doc in documents]


    def get_by_id(self,course_id: str):
        data = get_db()["course"].find_one({"_id": ObjectId(course_id)})
        print(data)
        if data:
            return Course(data["_id"], data["name"], data["purpose"])
        return None
    

    def delete_by_id(self,course_id: str) -> str:
        result = get_db()["course"].delete_one({"_id": ObjectId(course_id)})
        return course_id if result.deleted_count > 0 else ""