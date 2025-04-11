from pymongo import ReturnDocument

import database_connection


# Amount of stat points required for each level
LEVELS = {
    "messages": [1, 10, 100, 1000],
    "meal_plans": [1],
    "meals": [1, 7, 14],
    "workout_plans": [1],
    "workouts": [1, 7, 14]
}


def calculate_current_and_next_level(stat: str, counter: int) -> (int, int, int):
    """
    Calculates current and next level based on stst counter
    """
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
    Calculates progress after increment

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
    """
    Get all stats and user's progress for them
    """
    user_completed = await database_connection.get_user_stats().find_one({"user_id": user_id})

    stats = []

    for stat_name in LEVELS.keys():
        if user_completed and stat_name in user_completed:
            stats.append(calculate_stat(stat_name, user_completed.get(stat_name), 0))
        else:
            stats.append(calculate_stat(stat_name, 0, 0))

    return stats


async def update_stat(user_id: str, stat: str, increment: int = 1) -> {}:
    """
    Update user's stat counter
    """
    result = await database_connection.get_user_stats().find_one_and_update(
        {"user_id": user_id}, {"$inc": {stat: increment}}, upsert=True, return_document=ReturnDocument.AFTER
    )
    return calculate_stat(stat, result.get(stat))


async def delete_stats(user_id: str):
    """
    Deletes user's stats
    """
    await database_connection.get_user_stats().delete_one({"user_id": user_id})
