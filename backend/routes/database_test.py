import json

from fastapi import APIRouter

import database_connection


router = APIRouter()


@router.get("/insert")
async def insert_test():
    test = await database_connection.get_test().insert_one({"test": True})
    created = await database_connection.get_test().find_one({"_id": test.inserted_id})
    return {"document": json.dumps(created, default=str)}


@router.get("/list")
async def list_test():
    documents = await database_connection.get_test().find().to_list(None)
    return {"documents": json.dumps([document for document in documents], default=str)}
