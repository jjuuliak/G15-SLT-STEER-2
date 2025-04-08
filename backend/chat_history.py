import json
import time
from google.genai import types
from typing import Literal
import database_connection

HISTORY = {}


def format_history(history):
    """
    Format history to what the model expects

    :param history: history
    :return: formatted history
    """

    formatted_history = []
    for message in history:
        formatted_history.append(
            types.Content(role=message["role"], parts=[types.Part.from_text(text=message["text"])])
        )
    return formatted_history


async def close(user_id):
    """
    Closes user session's chat history

    :param user_id: user id
    """
    HISTORY.pop(user_id)


async def get_history(user_id):
    """
    Gets chat history or creates it if it doesn't exist and formats it for the AI

    :param user_id: user id
    :return: chat history or empty array if it didn't exist
    """
    if user_id not in HISTORY:
        HISTORY[user_id] = await load_history(user_id)

    return HISTORY[user_id].copy()  # Return a copy to not append next instruction into history


async def load_history(user_id, limit = 100):
    """
    Gets chat history or creates it if it doesn't exist and formats it for the AI

    :param user_id: user id
    :param limit: max history length to return
    :return: chat history or empty array if it didn't exist
    """
    document = await database_connection.get_chat_history().find_one({"user_id": user_id},
                                                                     {"history": {"$slice": -limit}})

    if not document:
        database_connection.get_chat_history().insert_one({"user_id": user_id, "history": []})
        return []

    return format_history(document.get("history", []))


async def read_history(user_id: str, skip: int = 0, limit: int = 10):
    """
    Gets a chunk of chat history to be sent to frontend

    :param user_id: user id
    :param skip: first message index
    :param limit: count of messages
    :return: chat history
    """

    document = await database_connection.get_chat_history().find_one({"user_id": user_id},
                                                                     {"history": {"$slice": [-limit - skip, limit]}})

    if not document:
        return []

    return document.get("history", [])


def store_history(user_id: str, question: str, answer: str, system: bool = False):
    """
    Stores a question-answer pair in chat history

    :param user_id: user id
    :param question: user question to ai
    :param answer: answer from ai
    :param system: whether entry is not directly caused by user's chat input but for example meal plan generation
    """

    if user_id in HISTORY:
        HISTORY[user_id].append(types.UserContent(parts=[types.Part.from_text(text=question)]))
        HISTORY[user_id].append(types.ModelContent(parts=[types.Part.from_text(text=answer)]))

    question_msg = {"system": system, "role": "user", "text": question, "time": time.time() - 1}
    answer_msg = {"system": system, "role": "model", "text": answer, "time": time.time()}

    database_connection.get_chat_history().update_one(
        {"user_id": user_id}, {"$push": {"history": {"$each": [question_msg, answer_msg]}}}
    )


async def get_plan(user_id: str, plan: Literal["meal_plan", "workout_plan"]):
    """
    Gets latest plan

    :param user_id: user id
    :param plan: plan type
    :return: plan
    """
    document = await database_connection.get_chat_history().find_one({"user_id": user_id}, {plan: 1})

    if not document:
        return None
    
    return json.dumps(document.get(plan, None))


def store_plan(user_id: str, plan: Literal["meal_plan", "workout_plan"], content):
    """
    Stores latest plan

    :param user_id: user id
    :param plan: plan type
    :param content: plan
    """

    content = json.loads(content)
    content["created"] = time.time()
    content["completed"] = False

    database_connection.get_chat_history().update_one(
        {"user_id": user_id}, {"$set": {plan: content}}, upsert=True
    )


async def complete_plan(user_id: str, plan: Literal["meal_plan", "workout_plan"]):
    """
    Marks plan as completed

    :param user_id: user id
    :param plan: plan type
    :return: true if success, false if plan doesn't exist or is already completed
    """

    document = await database_connection.get_chat_history().find_one({"user_id": user_id}, {plan: 1})

    if not document or plan not in document:
        return False

    content = document.get(plan)

    if content.get("completed"):
        return False

    content["completed"] = True

    await database_connection.get_chat_history().update_one(
        {"user_id": user_id}, {"$set": {plan: content}}
    )

    return True
