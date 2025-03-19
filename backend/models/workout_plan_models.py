from pydantic import BaseModel

# Note: Adding extra fields here without prompt seems to worsen the accuracy of produced responses

class Workout(BaseModel):
    """
    One planned workout
    """
    workout_description: str
    workout_each_step_and_how_long: list[str]


class DailyWorkoutPlan(BaseModel):
    """
    Workout plan for one day
    """
    daily_workouts: list[Workout]


class WorkoutPlan(BaseModel):
    """
    A complete workout plan for multiple days
    """
    explanation: str
    days: list[DailyWorkoutPlan]
