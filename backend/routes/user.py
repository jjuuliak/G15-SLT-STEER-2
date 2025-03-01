from fastapi import APIRouter, HTTPException, Security
from fastapi_jwt import JwtAuthorizationCredentials
from starlette import status

import database_connection
from auth_service import AuthService
from models.medical_info_model import MedicalInfo

router = APIRouter()


@router.post("/update-profile")
async def update_user_profile(request: MedicalInfo, credentials: JwtAuthorizationCredentials = Security(AuthService.get_access_security())):
    result = await database_connection.get_user_data().update_one({"user_id": credentials["user_id"]},
                                                            {"$set": request.model_dump(exclude={"id"})})

    if not result or not result.modified_count == 1:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="User data update failed")

    return {"status": "success"}
