from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from LLMService import LLMService
from dotenv import load_dotenv
import os
import json

load_dotenv()

async def connect_mongodb():
    db_user = os.getenv("MONGO_USER")
    db_password = os.getenv("MONGO_PASSWORD")

    print("Connecting to MongoDB")
    global mongo
    mongo = AsyncIOMotorClient(f"mongodb://{db_user}:{db_password}@database:27017/")
    print(await mongo.server_info())
    return

app = FastAPI()

api_key = os.getenv("API_KEY")
if not api_key:
    raise ValueError("API_KEY missing from environment variables")

llm_service = LLMService(api_key=api_key)
app.add_event_handler("startup", connect_mongodb)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def home():
    return {"message": "Hello from FastAPI!"}

class ChatRequest(BaseModel):
    user_id: str
    message: str

@app.post("/ask")
async def ask_llm(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    try:
        response_text = llm_service.send_message(request.user_id, request.message)
        return {"response": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_mongo():
    return app.state.mongo

@app.get("/insert")
async def insert_test():
    test = await mongo.get_database("test_database").get_collection("test_collection").insert_one({"test": True})
    created = await mongo.get_database("test_database").get_collection("test_collection").find_one({"_id": test.inserted_id})
    return {"document": json.dumps( created, default=str)}

@app.get("/list")
async def list_test():
    documents = await mongo.get_database("test_database").get_collection("test_collection").find().to_list(None)
    return {"documents": json.dumps( [document for document in documents], default=str)}
