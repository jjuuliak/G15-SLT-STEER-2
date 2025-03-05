from fastapi import APIRouter, HTTPException, Security
from fastapi_jwt import JwtAuthorizationCredentials
from starlette import status

import database_connection
from auth_service import AuthService
from models.login_model import UserLogin
from models.medical_info_model import MedicalInfo
from models.user_model import User


router = APIRouter()


@router.post("/register")
async def register(user_info: User):
    current_user = await database_connection.get_users().find_one({"email": user_info.email})

    if current_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Account exists")

    user_info.password = AuthService.hash_password(user_info.password)

    add_user = await database_connection.get_users().insert_one(user_info.model_dump(exclude={"id"}))

    # Prepare profile for userdata and send it (empty user) back as part of the response
    # TODO: We might want to have an user id as part of the schema instead of relying on mongodb
    user_id: str = str(add_user.inserted_id)
    user_data = MedicalInfo.model_validate({"user_id": user_id, "smoking": False})

    await database_connection.get_user_data().insert_one(user_data.model_dump(exclude={"id"}))

    access_token = AuthService.get_access_security().create_access_token(subject={"user_id": user_id})
    refresh_token = AuthService.get_refresh_security().create_refresh_token(subject={"user_id": user_id})

    return {"status": "success", "access_token": access_token, "refresh_token": refresh_token,
            "user_data": user_data.model_dump(exclude={"id", "user_id"})}


@router.post("/login")
async def login(user_info: UserLogin):
    existing_user = await database_connection.get_users().find_one({"email": user_info.email})

    if not existing_user or not AuthService.check_password(user_info.password, existing_user.get("password")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect login")

    # Get userdata and send it back as part of the response
    user_id: str = str(existing_user.get("_id"))
    user_data = await database_connection.get_user_data().find_one({"user_id": user_id})

    if not user_data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Missing user data")

    access_token = AuthService.get_access_security().create_access_token(subject={"user_id": user_id})
    refresh_token = AuthService.get_refresh_security().create_refresh_token(subject={"user_id": user_id})

    return {"status": "success", "access_token": access_token, "refresh_token": refresh_token,
            "user_data": {k: v for k, v in user_data.items() if k != "_id" and k != "user_id"}}


@router.post("/refresh")
def refresh(credentials: JwtAuthorizationCredentials = Security(AuthService.get_refresh_security())):
    access_token = AuthService.get_access_security().create_access_token(subject=credentials.subject)
    refresh_token = AuthService.get_refresh_security().create_refresh_token(subject=credentials.subject)

    return {"status": "success", "access_token": access_token, "refresh_token": refresh_token}
