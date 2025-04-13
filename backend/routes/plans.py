from fastapi import APIRouter, Security, HTTPException
from fastapi_jwt import JwtAuthorizationCredentials
from starlette import status

import chat_history
import user_stats
from auth_service import AuthService


router = APIRouter()


@router.post("/last-meal-plan")
async def get_meal_plan(credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    """
    Returns previously generated MealPlan or null
    """
    return {"meal_plan": await chat_history.get_plan(credentials["user_id"], "meal_plan")}


# TODO: What should happen when a plan is marked as completed? Should completed item/day be hidden or removed? Should the AI be let know?
#  Should more days be generated into the same plan? Is backend or frontend responsible for computing up to date plan?
@router.post("/complete-meal-plan")
async def complete_meal_plan(credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    """
    Announce meal plan completion to update stats
    """
    user_id = credentials["user_id"]

    if not await chat_history.complete_plan(user_id, "meal_plan"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No plan exists or already completed")

    return {"progress": await user_stats.update_stat(user_id, "meals")}


@router.post("/last-workout-plan")
async def get_workout_plan(credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    """
    Returns previously generated WorkoutPlan or null
    """
    return {"workout_plan": await chat_history.get_plan(credentials["user_id"], "workout_plan")}


# TODO: What should happen when a plan is marked as completed? Should completed item/day be hidden or removed? Should the AI be let know?
#  Should more days be generated into the same plan? Is backend or frontend responsible for computing up to date plan?
@router.post("/complete-workout-plan")
async def complete_workout_plan(credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    """
    Announce workout plan completion to update stats
    """
    user_id = credentials["user_id"]

    if not await chat_history.complete_plan(user_id, "workout_plan"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No plan exists or already completed")

    return {"progress": await user_stats.update_stat(user_id, "workouts")}
