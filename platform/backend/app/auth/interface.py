from typing import TypedDict, Optional


class UserInterface(TypedDict):
    username: str
    password: str
    first_name: str
    last_name: str


class LoginInterface(TypedDict):
    username: str
    password: str


class RefreshTokenInterface(TypedDict):
    refresh_token: str


class TokenResponse(TypedDict):
    access_token: str
    refresh_token: str
    token_type: str
    expires_in: int


class UserResponse(TypedDict):
    username: str
    first_name: str
    last_name: str
    is_active: bool

class ChangePasswordInterface(TypedDict):
    username: str
    old_password: str
    new_password: str