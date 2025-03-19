import time
from enum import Enum
from typing import Literal

import database_connection


temporary_plans = {}


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
    else:
        # AI has the plans in form of normal chat history now
        temporary_plans.pop(user_id)

    return format_history(document.get("history", []))


async def read_history(user_id, skip = 0, limit = 10, should_format_history: bool = False):
    """
    Gets a chunk of chat history to be sent to frontend

    :param user_id: user id
    :param skip: first message index
    :param limit: count of messages
    :param should_format_history: whether history should be formatted for the AI
    :return: chat history
    """

    document = await database_connection.get_chat_history().find_one({"user_id": user_id},
                                                                     {"history": {"$slice": [-limit - skip, limit]}})

    if not document:
        return []

    if should_format_history:
        return format_history(document.get("history", []))

    return document.get("history", [])


def store_history(user_id, question, answer):
    """
    Stores a question-answer pair in chat history

    :param user_id: user id
    :param question: user question to ai
    :param answer: answer from ai
    """

    question_msg = {"role": "user", "text": question, "time": time.time() - 1}
    answer_msg = {"role": "model", "text": answer, "time": time.time()}

    database_connection.get_chat_history().update_one(
        {"user_id": user_id}, {"$push": {"history": {"$each": [question_msg, answer_msg]}}}
    )


def store_temporary_contex(user_id: str, plan_type: Literal["meal plan", "workout plan"], plan: {}):
    """
    Stores additional context which does not exist in medical info nor in chat history the model sees yet. For example
    when generating a meal plan, generative model's output is given as temporary context for the chat model until next
    time user's full chat history is loaded for the model.
    """
    if user_id not in temporary_plans:
        temporary_plans[user_id] = {}

    temporary_plans[user_id][plan_type] = plan


def get_temporary_context(user_id:str) -> {}:
    """
    Stores additional context which does not exist in medical info nor in chat history the model sees yet. For example
    when generating a meal plan, generative model's output is given as temporary context for the chat model until next
    time user's full chat history is loaded for the model.
    """
    if user_id not in temporary_plans:
        return None

    return temporary_plans[user_id]
