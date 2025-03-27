from time import sleep

from utils.response import ResponseFor


def test_plans():
    # Give backend some time to start
    sleep(15)

    # Register, create test user
    response = ResponseFor("POST", "/register",
                 body={"name": "Plans", "email": "plans@example.org", "password": "Password123!"},
                 headers={"Content-Type": "application/json"})
    assert response.status == 200
    assert "access_token" in response.content

    access_token = response.content["access_token"]

    # Get last meal plan, should not exist
    response = ResponseFor("POST", "/last-meal-plan",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "meal_plan" in response.content
    assert response.content["meal_plan"] is None

    # Get last workout plan, should not exist
    response = ResponseFor("POST", "/last-workout-plan",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "workout_plan" in response.content
    assert response.content["workout_plan"] is None

    # Get stats, should have meals and workouts as 0
    response = ResponseFor("POST", "/get-stats",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "user_stats" in response.content
    for stat in response.content["user_stats"]:
        if stat["stat"] == "meals" or stat["stat"] == "workouts":
            assert stat["counter"] == 0

    # Complete meal plan, should update stats
    response = ResponseFor("POST", "/complete-meal-plan",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "progress" in response.content
    progress = response.content["progress"]
    assert "stat" in progress
    assert progress["stat"] == "meals"
    assert "counter" in progress
    assert progress["counter"] == 1

    # Complete workout plan, should update stats
    response = ResponseFor("POST", "/complete-workout-plan",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "progress" in response.content
    progress = response.content["progress"]
    assert "stat" in progress
    assert progress["stat"] == "workouts"
    assert "counter" in progress
    assert progress["counter"] == 1

    # Get stats, should have meals and workouts as 1
    response = ResponseFor("POST", "/get-stats",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "user_stats" in response.content
    for stat in response.content["user_stats"]:
        if stat["stat"] == "meals" or stat["stat"] == "workouts":
            assert stat["counter"] == 1
