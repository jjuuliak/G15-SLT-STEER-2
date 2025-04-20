from typing import Literal


def save_user_age(age: int) -> int:
    """Call when user provides their age"""
    return age


def save_user_weight(weight_kg: float) -> float:
    """Call when user provides their weight"""
    return weight_kg


def save_user_height(height_cm: int) -> int:
    """Call when user provides their height"""
    return height_cm


def save_user_gender(gender: Literal["male", "female", "other"]) -> str:
    """Call when user provides their gender"""
    return gender


def save_user_systolic_blood_pressure(systolic_blood_pressure_mmhg: int) -> int:
    """Call when user provides their systolic blood pressure"""
    return systolic_blood_pressure_mmhg


def save_user_diastolic_blood_pressure(diastolic_blood_pressure_mmhg: int) -> int:
    """Call when user provides their diastolic blood pressure"""
    return diastolic_blood_pressure_mmhg


def save_user_heart_rate(heart_rate_resting_bpm: int) -> int:
    """Call when user provides their heart rate"""
    return heart_rate_resting_bpm


def save_user_total_cholesterol(total_cholesterol_mmoll: float) -> float:
    """Call when user provides their total cholesterol"""
    return total_cholesterol_mmoll


def save_user_low_density_lipoprotein(low_density_lipoprotein_mmoll: float) -> float:
    """Call when user provides their low-density lipoprotein"""
    return low_density_lipoprotein_mmoll


def save_user_high_density_lipoprotein(high_density_lipoprotein_mmoll: float) -> float:
    """Call when user provides their high-density lipoprotein"""
    return high_density_lipoprotein_mmoll


def save_user_triglycerides(triglycerides_mmoll: float) -> float:
    """Call when user provides their triglycerides"""
    return triglycerides_mmoll


def save_user_smoking(smoking: bool) -> bool:
    """Call when user provides whether they smoke"""
    return smoking


def save_user_alcohol_consumption(alcohol_consumption_drinks_per_week: int) -> int:
    """Call when user provides their alcohol consumption"""
    return alcohol_consumption_drinks_per_week


def save_user_amount_of_sleep(sleep_daily_avg: float) -> float:
    """Call when user provides their amount of sleep"""
    return sleep_daily_avg


def save_user_other_past_medical_conditions(past_conditions: str) -> str:
    """Call when user provides their other past medical conditions"""
    return past_conditions


def save_user_other_current_medical_conditions(current_conditions: str) -> str:
    """Call when user provides their other current medical conditions"""
    return current_conditions


def save_user_exercise_activity(exercise_level: Literal["sedentary", "lightly active", "moderately active", "very active", "athlete"]) -> str:
    """Call when user provides their exercise activity"""
    return exercise_level


def save_user_medication(medication: str) -> str:
    """Call when user provides their medication"""
    return medication


def save_user_pregnancy(pregnancy: bool) -> bool:
    """Call when user provides whether they are pregnant"""
    return pregnancy


def save_user_waist_measurement(waist_measurement_cm: int) -> int:
    """Call when user provides their waist measurement"""
    return waist_measurement_cm


def save_user_family_history_with_heart_disease(family_history_with_heart_disease: bool) -> bool:
    """Call when user provides whether they have family history with heart disease"""
    return family_history_with_heart_disease


### Technically not attributes but functions the chat model can call to automate things ###


def set_meal_plan_changed(meal_plan_should_be_regenerated: bool) -> bool:
    """Call when user asks changes for meal plan so updated plan can be generated"""
    return meal_plan_should_be_regenerated


def set_workout_plan_changed(workout_plan_should_be_regenerated: bool) -> bool:
    """Call when user asks changes for workout plan so updated plan can be generated"""
    return workout_plan_should_be_regenerated
