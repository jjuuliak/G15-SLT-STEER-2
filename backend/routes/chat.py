import os

from fastapi import APIRouter, HTTPException, Security
from fastapi_jwt import JwtAuthorizationCredentials

from LLMService import LLMService
from auth_service import AuthService
from models.chat_model import ChatModel

router = APIRouter()


api_key = os.getenv("API_KEY")
if not api_key:
    raise ValueError("API_KEY missing from environment variables")


llm_service = LLMService(api_key=api_key)


@router.post("/ask")
async def ask_llm(request: ChatModel, credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    response_text = llm_service.send_message(credentials["user_id"], request.message)
    return {"response": response_text}
