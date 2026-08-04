from typing import TypedDict

class UserInterface(TypedDict, total=False):
    username: str
    password: str
    role: str
