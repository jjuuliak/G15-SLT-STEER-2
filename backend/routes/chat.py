import os

from fastapi import APIRouter, HTTPException, Security
from fastapi_jwt import JwtAuthorizationCredentials
from fastapi.responses import StreamingResponse
from starlette import status

import chat_history
from LLMService import LLMService
from auth_service import AuthService
from models.chat_model import ChatModel
from models.history_request_model import HistoryRequestModel


router = APIRouter()


llm_service = LLMService(api_key=os.getenv("API_KEY"))


@router.post("/ask")
async def ask_llm(request: ChatModel, credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    """
    Returns streamed answer from AI
    """
    if not request.message.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message cannot be empty")

    return StreamingResponse(llm_service.send_message(credentials["user_id"], request.message, request.language))


@router.post("/ask-meal-plan")
async def ask_meal_plan(request: ChatModel, credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    """
    Returns MealPlan from AI
    """
    if not request.message.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message cannot be empty")

    return await llm_service.ask_meal_plan(credentials["user_id"], request.message, request.language)


@router.post("/ask-workout-plan")
async def ask_workout_plan(request: ChatModel, credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    """
    Returns WorkoutPlan from AI
    """
    if not request.message.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message cannot be empty")

    return await llm_service.ask_workout_plan(credentials["user_id"], request.message, request.language)


@router.post("/history")
async def get_chat_history(request: HistoryRequestModel, credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    """
    Returns all existing chat message history for interval specified in HistoryRequestModel
        history: [{"system": true if meal/workout plan/request, "role": "model"/"user", "text": answer/question, "time": answer time (seconds since epoch)/answer time - 1}, ...]
    """
    return {"history": await chat_history.read_history(credentials["user_id"], request.start_index, request.count)}


@router.post("/clear-history")
async def get_chat_history(credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    """
    Clears all chat history and generated plans for the user
    """
    await chat_history.delete_history(credentials["user_id"])
    return {}
