import os
from pymongo import MongoClient
from bson import ObjectId

_mongo_client: MongoClient | None = None
_db_name: str | None = None

# TODO: move the env names to a config file

def init_db():

    global _mongo_client, _db_name
    uri = os.getenv("MONGO_DB_CONNECTION_STRING")
    if not uri:
        raise RuntimeError("Missing MONGO_DB_CONNECTION_STRING env var")
    _mongo_client = MongoClient(uri)
    _db_name = os.getenv("DB_NAME")
    if not _db_name:
        raise RuntimeError("Missing DB_NAME env var")

def get_db():

    if _mongo_client is None or _db_name is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    return _mongo_client[_db_name]


def insert_one(collection_name: str, document: dict) -> str:
    result = get_db()[collection_name].insert_one(document)
    return str(result.inserted_id)

def find_all(collection_name: str, filter: dict = None) -> list[dict]:
    cursor = get_db()[collection_name].find(filter or {})
    items = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        items.append(doc)
    return items

def find_one(collection_name: str, id: str) -> dict | None:
    try:
        oid = ObjectId(id)
    except Exception:
        return None
    doc = get_db()[collection_name].find_one({"_id": oid})
    if not doc:
        return None
    doc["_id"] = str(doc["_id"])
    return doc

def update_one(collection_name: str, id: str, changes: dict) -> bool:
    try:
        oid = ObjectId(id)
    except Exception:
        return False
    result = get_db()[collection_name].update_one(
        {"_id": oid}, {"$set": changes}
    )
    return result.matched_count > 0

def delete_one(collection_name: str, id: str) -> bool:
    try:
        oid = ObjectId(id)
    except Exception:
        return False
    result = get_db()[collection_name].delete_one({"_id": oid})
    return result.deleted_count > 0


def delete_all(collection_name: str) -> int:
    result = get_db()[collection_name].delete_many({})
    return result.deleted_count
