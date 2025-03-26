import database_connection


# TODO: progress/achievements checks or just calculate it on frontend based on levels/completed


LEVELS = {
    "messages": [1, 10, 100, 1000],
    "meal_plans": [1],
    "meals": [1, 7, 14],
    "workout_plans": [1],
    "workouts": [1, 7, 14]
}


async def get_stats(user_id: str) -> {}:
    user_stats = await database_connection.get_user_stats().find_one({"user_id": user_id})

    if not user_stats:
        return {"user_stats": {}, "levels": LEVELS}

    return {"user_stats": {k: v for k, v in user_stats.items() if k != "_id" and k != "user_id"}, "levels": LEVELS}


def increment_message_counter(user_id: str):
    """
    Increase user's sent messages counter by 1
    """
    database_connection.get_user_stats().update_one(
        {"user_id": user_id}, {"$inc": {"messages": 1}}, upsert=True
    )


def increment_meal_generate_counter(user_id: str):
    """
    Increase user's generated meal plans counter by 1
    """
    database_connection.get_user_stats().update_one(
        {"user_id": user_id}, {"$inc": {"meal_plans": 1}}, upsert=True
    )


def increment_meal_complete_counter(user_id: str):
    """
    Increase user's completed meal plans counter by 1
    """
    database_connection.get_user_stats().update_one(
        {"user_id": user_id}, {"$inc": {"meals": 1}}, upsert=True
    )


def increment_workout_generate_counter(user_id: str):
    """
    Increase user's generated workout plans counter by 1
    """
    database_connection.get_user_stats().update_one(
        {"user_id": user_id}, {"$inc": {"workout_plans": 1}}, upsert=True
    )


def increment_workout_complete_counter(user_id: str):
    """
    Increase user's completed workout plans counter by 1
    """
    database_connection.get_user_stats().update_one(
        {"user_id": user_id}, {"$inc": {"workouts": 1}}, upsert=True
    )

