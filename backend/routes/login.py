from bson import ObjectId
from fastapi import APIRouter, HTTPException, Security
from fastapi_jwt import JwtAuthorizationCredentials
from starlette import status

import chat_history
import database_connection
import user_stats
from auth_service import AuthService
from models.login_model import UserLogin
from models.user_model import User


router = APIRouter()


@router.post("/register")
async def register(user_info: User):
    current_user = await database_connection.get_users().find_one({"email": user_info.email})

    if current_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Account exists")

    user_info.password = AuthService.hash_password(user_info.password)

    add_user = await database_connection.get_users().insert_one(user_info.model_dump(exclude={"id", "name"}))

    if not add_user:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not create user")

    user_id: str = str(add_user.inserted_id)

    user_data = await database_connection.get_user_data().insert_one({"user_id": user_id, "name": user_info.name})

    if not user_data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not create user data")

    access_token = AuthService.get_access_security().create_access_token(subject={"user_id": user_id})
    refresh_token = AuthService.get_refresh_security().create_refresh_token(subject={"user_id": user_id})

    return {"access_token": access_token,  "refresh_token": refresh_token}


@router.post("/login")
async def login(user_info: UserLogin):
    existing_user = await database_connection.get_users().find_one({"email": user_info.email})

    if not existing_user or not AuthService.check_password(user_info.password, existing_user.get("password")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect login")

    user_id: str = str(existing_user.get("_id"))

    access_token = AuthService.get_access_security().create_access_token(subject={"user_id": user_id})
    refresh_token = AuthService.get_refresh_security().create_refresh_token(subject={"user_id": user_id})

    return {"access_token": access_token,  "refresh_token": refresh_token}


@router.post("/logout")  # with refresh_token
async def logout(credentials: JwtAuthorizationCredentials = Security(AuthService.get_refresh_security())):
    AuthService.set_refresh_token_expired(credentials.jti)  # access_token will expire within 15 minutes
    await chat_history.close_session(credentials["user_id"])
    return {}


@router.post("/refresh")  # with refresh_token
async def refresh(credentials: JwtAuthorizationCredentials = Security(AuthService.get_refresh_security())):
    if AuthService.is_refresh_token_expired(credentials.jti):  # or token created < last password change
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Login expired")

    access_token = AuthService.get_access_security().create_access_token(subject=credentials.subject)

    return {"access_token": access_token}


@router.post("/unregister")
async def register(credentials: JwtAuthorizationCredentials = Security(AuthService.get_refresh_security())):  # with refresh_token
    if AuthService.is_refresh_token_expired(credentials.jti):  # or token created < last password change
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Login expired")

    AuthService.set_refresh_token_expired(credentials.jti)  # access_token will expire within 15 minutes

    user_id = credentials["user_id"]
    result = await database_connection.get_users().delete_one({"_id": ObjectId(user_id)})

    if not result or result.deleted_count != 1:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not delete user")

    await database_connection.get_user_data().delete_one({"user_id": user_id})
    await chat_history.close_session(user_id)
    await chat_history.delete_history(user_id)
    await user_stats.delete_stats(user_id)
    return {}
