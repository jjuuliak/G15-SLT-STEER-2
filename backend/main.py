from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import LLMService

app = FastAPI()

llm_service = LLMService(api_key="")

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