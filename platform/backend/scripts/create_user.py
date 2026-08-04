"""Create a student account through the AIED authentication API."""

import argparse
import getpass
import os
import sys

import requests

DEFAULT_API_URL = os.getenv(
    "AIED_REGISTER_URL",
    "http://localhost:5000/api/auth/register",
)

STUDENT_ROLES = (
    "restricted-student",
    "normal-student",
)


def parse_arguments():
    parser = argparse.ArgumentParser(
        description="Create an AIED student account."
    )
    parser.add_argument("--username", required=True)
    parser.add_argument("--first-name", required=True)
    parser.add_argument("--last-name", required=True)
    parser.add_argument(
        "--role",
        choices=STUDENT_ROLES,
        default="restricted-student",
    )
    parser.add_argument(
        "--api-url",
        default=DEFAULT_API_URL,
        help="Registration endpoint URL.",
    )
    return parser.parse_args()


def prompt_for_password():
    password = getpass.getpass("Password: ")

    if len(password) < 8:
        raise ValueError("Password must contain at least 8 characters.")

    confirmation = getpass.getpass("Confirm password: ")

    if password != confirmation:
        raise ValueError("Password confirmation does not match.")

    return password


def create_user(api_url, username, password, first_name, last_name, role):
    payload = {
        "username": username,
        "password": password,
        "first_name": first_name,
        "last_name": last_name,
        "role": role,
    }

    response = requests.post(
        api_url,
        json=payload,
        timeout=15,
    )

    if response.status_code not in (200, 201):
        raise RuntimeError(
            f"Registration failed with HTTP {response.status_code}."
        )


def main():
    args = parse_arguments()

    try:
        password = prompt_for_password()

        create_user(
            api_url=args.api_url,
            username=args.username,
            password=password,
            first_name=args.first_name,
            last_name=args.last_name,
            role=args.role,
        )
    except (ValueError, RuntimeError, requests.RequestException) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    print("User created successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
