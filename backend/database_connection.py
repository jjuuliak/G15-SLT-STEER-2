import os

from motor.motor_asyncio import AsyncIOMotorClient


USERS_DATABASE = "users_db"
USERS_COLLECTION = "users"

USER_DATA_DATABASE = "user_data_db"
USER_DATA_COLLECTION = "user_data"

USER_STATS_DATABASE = "user_stats_db"
USER_STATS_COLLECTION = "user_stats"

CHAT_HISTORY_DATABASE = "chat_history_db"
CHAT_HISTORY_COLLECTION = "chat_history"


async def connect_mongodb():
    """
    Connects to the database
    """

    db_user = os.getenv("MONGO_USER")
    db_password = os.getenv("MONGO_PASSWORD")

    print("Connecting to MongoDB", flush=True)
    global mongo
    mongo = AsyncIOMotorClient(f"mongodb://{db_user}:{db_password}@database:27017/")
    print(await mongo.server_info(), flush=True)
    await get_users().create_index([("email", 1)], unique=True)
    await get_user_data().create_index([("user_id", 1)], unique=True)
    await get_user_stats().create_index([("user_id", 1)], unique=True)
    await get_chat_history().create_index([("user_id", 1)], unique=True)


def get_users():
    """
    Gets user account collection
    """
    return mongo.get_database(USERS_DATABASE).get_collection(USERS_COLLECTION)


def get_user_data():
    """
    Gets user profile collection
    """
    return mongo.get_database(USER_DATA_DATABASE).get_collection(USER_DATA_COLLECTION)


def get_user_stats():
    """
    Gets user stats collection
    """
    return mongo.get_database(USER_STATS_DATABASE).get_collection(USER_STATS_COLLECTION)


def get_chat_history():
    """
    Gets user chat history collection
    """
    return mongo.get_database(CHAT_HISTORY_DATABASE).get_collection(CHAT_HISTORY_COLLECTION)
