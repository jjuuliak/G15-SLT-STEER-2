from pymongo import ReturnDocument

import database_connection


LEVELS = {
    "messages": [1, 10, 100, 1000],
    "meal_plans": [1],
    "meals": [1, 7, 14],
    "workout_plans": [1],
    "workouts": [1, 7, 14]
}


def calculate_current_and_next_level(stat: str, counter: int) -> (int, int, int):
    levels = LEVELS[stat]

    level = 0

    for requirement in levels:
        if counter >= requirement:
            level += 1

    if level >= len(levels):
        next_level = -1
    else:
        next_level = levels[level]

    return level, next_level, levels


def calculate_stat(stat: str, counter: int, increment: int = 1) -> {}:
    """
    stat: stat name
    counter: current count of events
    increment: how many events were added to the stat
    level: level based on counter value, 0 if no level has been reached yet
    next_level: counter value required for next level, -1 if maximum level has been reached
    levels: counter requirements for each stat level
    level_up: whether stat level was increased
    """
    if not counter:
        counter = 0

    level, next_level, levels = calculate_current_and_next_level(stat, counter)

    return {"stat": stat, "counter": counter, "increment": increment, "level": level, "next_level": next_level,
            "levels": levels, "level_up": calculate_current_and_next_level(stat, counter - increment)[0] != level}


async def get_stats(user_id: str) -> []:
    user_completed = await database_connection.get_user_stats().find_one({"user_id": user_id})

    stats = []

    for stat_name in LEVELS.keys():
        if user_completed and stat_name in user_completed:
            stats.append(calculate_stat(stat_name, user_completed.get(stat_name), 0))
        else:
            stats.append(calculate_stat(stat_name, 0, 0))

    return stats


async def increment_message_counter(user_id: str) -> {}:
    """
    Increase user's sent messages counter by 1
    """
    result = await database_connection.get_user_stats().find_one_and_update(
        {"user_id": user_id}, {"$inc": {"messages": 1}}, upsert=True, return_document=ReturnDocument.AFTER
    )
    return calculate_stat("messages", result.get("messages"))


async def increment_meal_generate_counter(user_id: str) -> {}:
    """
    Increase user's generated meal plans counter by 1
    """
    result = await database_connection.get_user_stats().find_one_and_update(
        {"user_id": user_id}, {"$inc": {"meal_plans": 1}}, upsert=True, return_document=ReturnDocument.AFTER
    )
    return calculate_stat("meal_plans", result.get("meal_plans"))


async def increment_meal_complete_counter(user_id: str) -> {}:
    """
    Increase user's completed meal plans counter by 1
    """
    result = await database_connection.get_user_stats().find_one_and_update(
        {"user_id": user_id}, {"$inc": {"meals": 1}}, upsert=True, return_document=ReturnDocument.AFTER
    )
    return calculate_stat("meals", result.get("meals"))


async def increment_workout_generate_counter(user_id: str) -> {}:
    """
    Increase user's generated workout plans counter by 1
    """
    result = await database_connection.get_user_stats().find_one_and_update(
        {"user_id": user_id}, {"$inc": {"workout_plans": 1}}, upsert=True, return_document=ReturnDocument.AFTER
    )
    return calculate_stat("workout_plans", result.get("workout_plans"))


async def increment_workout_complete_counter(user_id: str) -> {}:
    """
    Increase user's completed workout plans counter by 1
    """
    result = await database_connection.get_user_stats().find_one_and_update(
        {"user_id": user_id}, {"$inc": {"workouts": 1}}, upsert=True, return_document=ReturnDocument.AFTER
    )
    return calculate_stat("workouts", result.get("workouts"))
