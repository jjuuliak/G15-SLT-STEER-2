from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from LLMService import LLMService
from dotenv import load_dotenv
import os

app = FastAPI()
load_dotenv()
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