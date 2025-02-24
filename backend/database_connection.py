import os

from motor.motor_asyncio import AsyncIOMotorClient


USERS_DATABASE = "users_db"
USERS_COLLECTION = "users"

USER_DATA_DATABASE = "user_data_db"
USER_DATA_COLLECTION = "user_data"

CHAT_HISTORY_DATABASE = "chat_history_db"
CHAT_HISTORY_COLLECTION = "chat_history"


async def connect_mongodb():
    db_user = os.getenv("MONGO_USER")
    db_password = os.getenv("MONGO_PASSWORD")

    print("Connecting to MongoDB")
    global mongo
    mongo = AsyncIOMotorClient(f"mongodb://{db_user}:{db_password}@database:27017/")
    print(await mongo.server_info())
    await get_users().create_index([("email", 1)], unique=True)
    await get_user_data().create_index([("user_id", 1)], unique=True)
    await get_chat_history().create_index([("user_id", 1)], unique=True)
    return


def get_users():
    return mongo.get_database(USERS_DATABASE).get_collection(USERS_COLLECTION)


def get_user_data():
    return mongo.get_database(USER_DATA_DATABASE).get_collection(USER_DATA_COLLECTION)


def get_chat_history():
    return mongo.get_database(CHAT_HISTORY_DATABASE).get_collection(CHAT_HISTORY_COLLECTION)
