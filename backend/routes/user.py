from fastapi import APIRouter, HTTPException, Security
from fastapi_jwt import JwtAuthorizationCredentials
from starlette import status

import database_connection
from auth_service import AuthService
from models.medical_info_model import MedicalInfo

router = APIRouter()


@router.post("/get-profile")
async def get_user_profile(credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    """
    Gets user's profile (attributes/medical info)
    """
    user_data = await database_connection.get_user_data().find_one({"user_id": credentials["user_id"]})

    if not user_data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Missing user data")

    return {"user_data": {k: v for k, v in user_data.items() if k != "_id" and k != "user_id"}}


@router.post("/update-profile")
async def update_user_profile(request: MedicalInfo, credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    """
    Updates user's profile (attributes/medical info)
    """
    update_data = {"$set": {k: v for k, v in request.model_dump(exclude_unset=True, exclude={"id"}).items()}}

    result = await database_connection.get_user_data().update_one({"user_id": credentials["user_id"]}, update_data)

    if not result or not result.modified_count == 1:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="User data update failed")

    return {}
