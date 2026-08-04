class User:
    def __init__(
        self,
        user_id: str,
        username: str,
        password: str,
        role: str,  # "admin" | "student_chat" | "student_plain"
    ):
        self.user_id = user_id
        self.username = username
        self.password = password
        self.role = role

    def to_dict(self) -> dict:
        return {
            "_id": self.user_id,
            "username": self.username,
            "password": self.password,
            "role": self.role,
        }
