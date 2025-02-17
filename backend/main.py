import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import database_connection
from LLMService import LLMService
from routes import database_test
from routes import login


load_dotenv()


app = FastAPI()
app.add_event_handler("startup", database_connection.connect_mongodb)
app.include_router(database_test.router)
app.include_router(login.router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"])  # TODO


api_key = os.getenv("API_KEY")
if not api_key:
    raise ValueError("API_KEY missing from environment variables")


llm_service = LLMService(api_key=api_key)


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
