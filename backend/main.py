import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from requests import Request
from starlette import status

import database_connection
from routes import chat, login, plans, stats, user


load_dotenv()

if not os.getenv("API_KEY"):
    raise ValueError("API_KEY missing from environment variables")

app = FastAPI()
app.add_event_handler("startup", database_connection.connect_mongodb)
app.include_router(chat.router)
app.include_router(login.router)
app.include_router(plans.router)
app.include_router(stats.router)
app.include_router(user.router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"])  # TODO


# Test only: print more details on schema validation errors
logger = logging.getLogger(__name__)
@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error for: {await request.json()}")
    logger.error(f"Errors: {exc.errors()}")
    raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Schema validation failed")


@app.get("/")
async def home():
    return {"message": "Hello from FastAPI!"}
