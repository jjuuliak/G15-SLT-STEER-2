import json
import os
import secrets
import string

# noinspection PyPackageRequirements
from bson import ObjectId
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Security
from fastapi_jwt import JwtAuthorizationCredentials, JwtAccessBearer
from pydantic import BaseModel
from starlette import status
from starlette.responses import Response

import database_connection
from LLMService import LLMService
from models.user_model import UserModel

load_dotenv()

app = FastAPI()

api_key = os.getenv("API_KEY")
if not api_key:
    raise ValueError("API_KEY missing from environment variables")

llm_service = LLMService(api_key=api_key)
app.add_event_handler("startup", database_connection.connect_mongodb)


characters = string.ascii_letters + string.digits + string.punctuation
access_security = JwtAccessBearer(secret_key="".join(secrets.choice(characters) for _ in range(32)), auto_error=True)


@app.get("/")
async def home():
    return {"message": "Hello from FastAPI!"}


class ChatRequest(BaseModel):
    user_id: str
    message: str


@app.post("/ask")
async def ask_llm(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    try:
        response_text = llm_service.send_message(request.user_id, request.message)
        return {"response": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/insert")
async def insert_test():
    test = await database_connection.get_test().insert_one({"test": True})
    created = await database_connection.get_test().find_one({"_id": test.inserted_id})
    return {"document": json.dumps(created, default=str)}


@app.get("/list")
async def list_test():
    documents = await database_connection.get_test().find().to_list(None)
    return {"documents": json.dumps([document for document in documents], default=str)}


@app.post("/register")
async def register(user_info: UserModel, response: Response):
    current_user = await database_connection.get_users().find_one({"email": user_info.email})

    if current_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Account exists")

    add_user = await database_connection.get_users().insert_one(user_info.model_dump(by_alias=True, exclude={"id"}))

    # Prepare profile for userdata and send it (empty user) back as part of the response
    # TODO: Use a model for this too
    # TODO: We might want to have an user id as part of the schema instead of relying on mongodb
    user_id: str = str(add_user.inserted_id)
    user_data = {"user_id": user_id, "test": True}

    await database_connection.get_user_data().insert_one(user_data)

    access_token = access_security.create_access_token(subject={"user_id": user_id})
    access_security.set_access_cookie(response, access_token)

    user_data = {key: str(value) if isinstance(value, ObjectId) else value for key, value in user_data.items()}

    return {"status": "success", "access_token": access_token, "user_data": user_data}


@app.post("/login")
async def login(user_info: UserModel, response: Response):
    existing_user = await database_connection.get_users().find_one({"email": user_info.email})

    if not existing_user or user_info.password != existing_user.get("password"):
        print("existing_user", existing_user, "user_info.password", user_info.password, "existing_user.get(password)", existing_user.get("password"))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect login")

    # Get userdata and send it back as part of the response
    # TODO: Use a model for this too
    # TODO: Maybe we don't actually want to send back the whole user data especially if it contains long chat histories
    user_id: str = str(existing_user.get("_id"))
    user_data = await database_connection.get_user_data().find_one({"user_id": user_id})

    access_token = access_security.create_access_token(subject={"user_id": user_id})
    access_security.set_access_cookie(response, access_token)

    user_data = {key: str(value) if isinstance(value, ObjectId) else value for key, value in user_data.items()}

    return {"status": "success", "access_token": access_token, "user_data": user_data}


@app.post("/logout")
async def logout(response: Response):
    # TODO: This does not actually log out, look for better jwt implementation
    access_security.unset_access_cookie(response)
    return {"status": "success"}


@app.post("/test")
async def user_test(credentials: JwtAuthorizationCredentials = Security(access_security)):
    user_data = await database_connection.get_user_data().find_one({"user_id": credentials["user_id"]})
    user_data = {key: str(value) if isinstance(value, ObjectId) else value for key, value in user_data.items()}
    return {"user_data": user_data}
