import os

from fastapi import APIRouter, HTTPException, Security
from fastapi_jwt import JwtAuthorizationCredentials

import chat_history
from LLMService import LLMService
from auth_service import AuthService
from models.chat_model import ChatModel
from models.history_request_model import HistoryRequestModel

router = APIRouter()


api_key = os.getenv("API_KEY")
if not api_key:
    raise ValueError("API_KEY missing from environment variables")


llm_service = LLMService(api_key=api_key)


@router.post("/ask")
async def ask_llm(request: ChatModel, credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    return await llm_service.send_message(credentials["user_id"], request.message)


@router.post("/history")
async def get_chat_history(request: HistoryRequestModel, credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    return {"history": await chat_history.read_history(credentials["user_id"], request.start_index, request.count)}
