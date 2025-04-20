from utils.response import ResponseFor, TestAccountFor


def test_plans():
    account = TestAccountFor("Plans")
    access_token = account.access_token

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

    account.unregister()

''' Can't run these tests without being able to create a meal plan
    # Complete non-existing meal plan, should fail
    response = ResponseFor("POST", "/complete-meal-plan",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 400
    assert "progress" not in response.content

    # Complete non-existing workout plan, should fail
    response = ResponseFor("POST", "/complete-workout-plan",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 400
    assert "progress" not in response.content

    # Create meal plan
    # TODO

    # Get last meal plan, should be not be completed
    response = ResponseFor("POST", "/last-meal-plan",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "meal_plan" in response.content
    assert response.content["meal_plan"]
    meal_plan = response.content["meal_plan"]
    assert "completed" in meal_plan
    assert meal_plan["completed"] is False

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

    # Get last meal plan, should be completed
    response = ResponseFor("POST", "/last-meal-plan",
                           headers={"Content-Type": "application/json",
                                    "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "meal_plan" in response.content
    assert response.content["meal_plan"]
    meal_plan = response.content["meal_plan"]
    assert "completed" in meal_plan
    assert meal_plan["completed"] is True

    # Create workout plan
    # TODO

    # Get last workout plan, should not be completed
    response = ResponseFor("POST", "/last-workout-plan",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "workout_plan" in response.content
    assert response.content["workout_plan"]
    workout_plan = response.content["workout_plan"]
    assert "completed" in workout_plan
    assert workout_plan["completed"] is False

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

    # Get last workout plan, should be completed
    response = ResponseFor("POST", "/last-workout-plan",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "workout_plan" in response.content
    assert response.content["workout_plan"]
    workout_plan = response.content["workout_plan"]
    assert "completed" in workout_plan
    assert workout_plan["completed"] is True
'''
