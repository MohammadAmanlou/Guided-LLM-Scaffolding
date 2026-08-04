"""Export uploaded answers or official answer sheets from MongoDB."""

import argparse
import sys
from pathlib import Path

from dotenv import load_dotenv
from pymongo.errors import PyMongoError

BACKEND_DIRECTORY = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIRECTORY))

load_dotenv(BACKEND_DIRECTORY / ".env")

from app.db import get_db, init_db  # noqa: E402


def parse_arguments():
    parser = argparse.ArgumentParser(
        description="Export assessment files from the AIED database."
    )
    subparsers = parser.add_subparsers(
        dest="command",
        required=True,
    )

    answer_parser = subparsers.add_parser(
        "answer",
        help="Export one uploaded student answer.",
    )
    answer_parser.add_argument("--practice-id", type=int, required=True)
    answer_parser.add_argument("--question-id", type=int, required=True)
    answer_parser.add_argument("--user-id", required=True)
    answer_parser.add_argument(
        "--output-dir",
        default="exports",
    )

    sheet_parser = subparsers.add_parser(
        "answer-sheet",
        help="Export an official practice answer sheet.",
    )
    sheet_parser.add_argument("--practice-id", type=int, required=True)
    sheet_parser.add_argument(
        "--output-dir",
        default="exports",
    )

    return parser.parse_args()


def write_exported_file(output_dir, filename, file_data):
    safe_filename = Path(filename).name

    if not safe_filename:
        raise ValueError("The database record has an invalid filename.")

    destination_directory = Path(output_dir)
    destination_directory.mkdir(parents=True, exist_ok=True)

    destination = destination_directory / safe_filename
    destination.write_bytes(bytes(file_data))

    return destination


def export_uploaded_answer(
    practice_id,
    question_id,
    user_id,
    output_dir,
):
    document = get_db()["answers"].find_one(
        {
            "practiceId": practice_id,
            "questionId": question_id,
            "userId": user_id,
        },
        {
            "_id": 0,
            "fileName": 1,
            "fileData": 1,
        },
    )

    if not document or "fileData" not in document:
        raise LookupError("No matching uploaded answer was found.")

    filename = document.get(
        "fileName",
        f"answer_{practice_id}_{question_id}.bin",
    )

    return write_exported_file(
        output_dir,
        filename,
        document["fileData"],
    )


def export_answer_sheet(practice_id, output_dir):
    document = get_db()["answer_sheets"].find_one(
        {"practiceId": practice_id},
        {
            "_id": 0,
            "fileName": 1,
            "fileData": 1,
        },
    )

    if not document or "fileData" not in document:
        raise LookupError("No matching answer sheet was found.")

    filename = document.get(
        "fileName",
        f"answer_sheet_{practice_id}.pdf",
    )

    return write_exported_file(
        output_dir,
        filename,
        document["fileData"],
    )


def main():
    arguments = parse_arguments()

    try:
        init_db()

        if arguments.command == "answer":
            destination = export_uploaded_answer(
                practice_id=arguments.practice_id,
                question_id=arguments.question_id,
                user_id=arguments.user_id,
                output_dir=arguments.output_dir,
            )
        else:
            destination = export_answer_sheet(
                practice_id=arguments.practice_id,
                output_dir=arguments.output_dir,
            )
    except (
        LookupError,
        OSError,
        RuntimeError,
        ValueError,
        PyMongoError,
    ) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    print(f"Exported file: {destination}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
