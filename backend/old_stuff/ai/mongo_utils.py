import os
from pymongo import MongoClient
from dotenv import load_dotenv


def get_mongo_client():
    load_dotenv()
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/ai_nurse_db")
    return MongoClient(mongo_uri)


def get_database():
    client = get_mongo_client()
    db_name = os.getenv("MONGODB_DB")
    if db_name:
        return client[db_name]
    # Try default database from URI
    try:
        return client.get_default_database()
    except Exception:
        return client["ai_nurse_db"]


def get_collection(name):
    db = get_database()
    return db[name]
