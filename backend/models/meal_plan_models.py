from typing import Literal

from pydantic import BaseModel

# Note: Adding extra fields here without prompt seems to worsen the accuracy of produced responses

class Meal(BaseModel):
    """
    One planned meal
    """
    meal: Literal["Breakfast", "Lunch", "Dinner", "Snack"]
    meal_description: str
    meal_content: list[str]


class DailyMealPlan(BaseModel):
    """
    Meal plan for one day
    """
    daily_meals: list[Meal]


class MealPlan(BaseModel):
    """
    A complete meal plan for multiple days
    """
    explanation: str
    days: list[DailyMealPlan]
