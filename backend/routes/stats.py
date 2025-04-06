from fastapi import APIRouter, Security
from fastapi_jwt import JwtAuthorizationCredentials
import user_stats
from auth_service import AuthService


router = APIRouter()


@router.post("/get-stats")
async def get_user_stats(credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    """
    Returns all stats and user's progress (See user_stats.calculate_stat)
    """
    return {"user_stats": await user_stats.get_stats(credentials["user_id"])}
