import json
import time

import database_connection


def format_history(history):
    """
    Format history to what the model expects

    :param history: history
    :return: formatted history
    """

    formatted_history = []
    for message in history:
        formatted_history.append({
            "role": message["role"],
            "parts": [{"text": message["text"]}]
        })
    return formatted_history


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


async def read_history(user_id, skip = 0, limit = 10):
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


def store_history(user_id, question, answer, system: bool = False):
    """
    Stores a question-answer pair in chat history

    :param user_id: user id
    :param question: user question to ai
    :param answer: answer from ai
    :param system: whether entry is not directly caused by user's chat input but for example meal plan generation
    """

    question_msg = {"system": system, "role": "user", "text": question, "time": time.time() - 1}
    answer_msg = {"system": system, "role": "model", "text": answer, "time": time.time()}

    database_connection.get_chat_history().update_one(
        {"user_id": user_id}, {"$push": {"history": {"$each": [question_msg, answer_msg]}}}
    )


async def get_meal_plan(user_id):
    """
    Gets latest meal plan
    """
    document = await database_connection.get_chat_history().find_one({"user_id": user_id}, {"meal_plan": 1})

    if not document:
        return None

    return document.get("meal_plan", None)


def store_meal_plan(user_id, meal_plan):
    """
    Stores latest meal plan
    """
    meal_plan = json.loads(meal_plan)
    meal_plan["created"] = time.time()
    meal_plan["completed"] = False

    database_connection.get_chat_history().update_one(
        {"user_id": user_id}, {"$set": {"meal_plan": meal_plan}}, upsert=True
    )


async def complete_meal_plan(user_id):
    """
    Marks meal plan as completed

    :param user_id: user id
    :return: true if success, false if it doesn't exist or is already completed
    """

    document = await database_connection.get_chat_history().find_one({"user_id": user_id}, {"meal_plan": 1})

    if not document or "meal_plan" not in document:
        return False

    meal_plan = document.get("meal_plan")

    if meal_plan.get("completed"):
        return False

    meal_plan["completed"] = True

    await database_connection.get_chat_history().update_one(
        {"user_id": user_id}, {"$set": {"meal_plan": meal_plan}}
    )

    return True


async def get_workout_plan(user_id):
    """
    Gets latest workout plan
    """
    document = await database_connection.get_chat_history().find_one({"user_id": user_id}, {"workout_plan": 1})

    if not document:
        return None

    return document.get("workout_plan", None)


def store_workout_plan(user_id, workout_plan):
    """
    Stores latest workout plan
    """
    workout_plan = json.loads(workout_plan)
    workout_plan["created"] = time.time()
    workout_plan["completed"] = False

    database_connection.get_chat_history().update_one(
        {"user_id": user_id}, {"$set": {"workout_plan": workout_plan}}, upsert=True
    )


async def complete_workout_plan(user_id):
    """
    Marks workout plan as completed

    :param user_id: user id
    :return: true if success, false if it doesn't exist or is already completed
    """

    document = await database_connection.get_chat_history().find_one({"user_id": user_id}, {"workout_plan": 1})

    if not document or "workout_plan" not in document:
        return False

    workout_plan = document.get("workout_plan")

    if workout_plan.get("completed"):
        return False

    workout_plan["completed"] = True

    await database_connection.get_chat_history().update_one(
        {"user_id": user_id}, {"$set": {"workout_plan": workout_plan}}
    )

    return True
