class Course:
    def __init__(self, course_id:str, name: str, purpose: str):
        self.course_id = course_id
        self.name = name
        self.purpose = purpose

    def to_dict(self):
        return {
            "_id": self.course_id,
            "name": self.name,
            "purpose": self.purpose,
        }


