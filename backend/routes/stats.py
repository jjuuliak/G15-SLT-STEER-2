from fastapi import APIRouter, Security
from fastapi_jwt import JwtAuthorizationCredentials
import user_stats
from auth_service import AuthService


router = APIRouter()


# TODO: let frontend mark plans as completed


@router.post("/get-stats")
async def get_user_stats(credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    return user_stats.get_stats(credentials["user_id"])
