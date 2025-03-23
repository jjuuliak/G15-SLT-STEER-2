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


def store_history(user_id, question, answer):
    """
    Stores a question-answer pair in chat history

    :param user_id: user id
    :param question: user question to ai
    :param answer: answer from ai
    :return:
    """

    # TODO: question may contain additional context for the ai which we don't want to save
    question_msg = {"role": "user", "text": question, "time": time.time() - 1}
    answer_msg = {"role": "model", "text": answer, "time": time.time()}

    database_connection.get_chat_history().update_one(
        {"user_id": user_id}, {"$push": {"history": {"$each": [question_msg, answer_msg]}}}
    )
