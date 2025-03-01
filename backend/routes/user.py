from fastapi import APIRouter, HTTPException, Security
from fastapi_jwt import JwtAuthorizationCredentials
from starlette import status

import database_connection
from auth_service import AuthService
from models.medical_info_model import MedicalInfo

router = APIRouter()


@router.post("/update-profile")
async def update_user_profile(request: MedicalInfo, credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    # Don't replace existing values with null if not present
    update_data = {"$set": {k: v for k, v in request.model_dump(exclude_unset=True, exclude={"id"}).items() if v is not None}}

    result = await database_connection.get_user_data().update_one({"user_id": credentials["user_id"]}, update_data)

    if not result or not result.modified_count == 1:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="User data update failed")

    return {"status": "success"}
