import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient


async def connect_mongodb():
    print("Loading .env")
    load_dotenv()
    db_user = os.getenv("MONGO_USER")
    db_password = os.getenv("MONGO_PASSWORD")

    print("Connecting to MongoDB")
    global mongo
    mongo = AsyncIOMotorClient(f"mongodb://{db_user}:{db_password}@database:27017/")
    print(await mongo.server_info())
    return


app = FastAPI()
app.add_event_handler("startup", connect_mongodb)


@app.get("/")
async def home():
    return {"message": "Hello from FastAPI!"}


@app.get("/insert")
async def insert_test():
    test = await mongo.get_database("test_database").get_collection("test_collection").insert_one({"test": True})
    created = await mongo.get_database("test_database").get_collection("test_collection").find_one({"_id": test.inserted_id})
    return {"document": json.dumps( created, default=str)}


@app.get("/list")
async def list_test():
    documents = await mongo.get_database("test_database").get_collection("test_collection").find().to_list(None)
    return {"documents": json.dumps( [document for document in documents], default=str)}
