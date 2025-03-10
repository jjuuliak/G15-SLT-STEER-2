from fastapi import APIRouter, HTTPException
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

    if not add_user:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not create user")

    user_id: str = str(add_user.inserted_id)

    user_data = await database_connection.get_user_data().insert_one({"user_id": user_id})

    if not user_data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not create user data")

    access_token = AuthService.get_access_security().create_access_token(subject={"user_id": user_id})

    return {"access_token": access_token}


@router.post("/login")
async def login(user_info: UserLogin):
    existing_user = await database_connection.get_users().find_one({"email": user_info.email})

    if not existing_user or not AuthService.check_password(user_info.password, existing_user.get("password")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect login")

    user_id: str = str(existing_user.get("_id"))

    access_token = AuthService.get_access_security().create_access_token(subject={"user_id": user_id})

    return {"access_token": access_token}
