from fastapi import APIRouter, Security
from fastapi_jwt import JwtAuthorizationCredentials
import chat_history
import user_stats
from auth_service import AuthService


router = APIRouter()


@router.post("/last-meal-plan")
async def get_meal_plan(credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    """
    Returns previously generated MealPlan or null
    """
    return {"meal_plan": await chat_history.get_meal_plan(credentials["user_id"])}


# TODO: What should happen when a plan is marked as completed? Should completed item/day be hidden or removed? Should the AI be let know?
#  Should more days be generated into the same plan? Is backend or frontend responsible for computing up to date plan?
#@router.post("/update-meal-plan")
#async def update_meal_plan(plan: MealPlan, credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
#    """
#    Updates previously generated MealPlan
#    """
#    await chat_history.update_meal_plan(credentials["user_id"], plan)
#    return {}


@router.post("/complete-meal-plan")
async def complete_meal_plan(credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    """
    Announce meal plan item completion to update stats (TODO: integrate this to update-meal-plan if ever implemented)
    """
    return {"progress": await user_stats.update_stat(credentials["user_id"], "meals")}


@router.post("/last-workout-plan")
async def get_workout_plan(credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    """
    Returns previously generated WorkoutPlan or null
    """
    return {"workout_plan": await chat_history.get_workout_plan(credentials["user_id"])}


# TODO: What should happen when a plan is marked as completed? Should completed item/day be hidden or removed? Should the AI be let know?
#  Should more days be generated into the same plan? Is backend or frontend responsible for computing up to date plan?
#@router.post("/update-workout-plan")
#async def update_workout_plan(plan: WorkoutPlan, credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
#    """
#    Updates previously generated WorkoutPlan
#    """
#    await chat_history.update_workout_plan(credentials["user_id"], plan)
#    return {}


@router.post("/complete-workout-plan")
async def complete_workout_plan(credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    """
    Announce workout plan item completion to update stats (TODO: integrate this to update-workout-plan if ever implemented)
    """
    return {"progress": await user_stats.update_stat(credentials["user_id"], "workouts")}
