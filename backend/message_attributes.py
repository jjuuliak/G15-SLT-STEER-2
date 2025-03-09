from typing import Literal


def save_user_age(age: int) -> int:
    """Call when user provides their age"""
    return age


def save_user_weight(weight: float) -> float:
    """Call when user provides their weight"""
    return weight


def save_user_height(height: int) -> int:
    """Call when user provides their height"""
    return height


def save_user_gender(gender: Literal["male", "female", "other"]) -> str:
    """Call when user provides their gender"""
    return gender


def save_user_systolic_blood_pressure(systolic_blood_pressure: int) -> int:
    """Call when user provides their systolic blood pressure"""
    return systolic_blood_pressure


def save_user_diastolic_blood_pressure(diastolic_blood_pressure: int) -> int:
    """Call when user provides their diastolic blood pressure"""
    return diastolic_blood_pressure


def save_user_heart_rate(heart_rate: int) -> int:
    """Call when user provides their heart rate"""
    return heart_rate


def save_user_total_cholesterol(total_cholesterol: float) -> float:
    """Call when user provides their total cholesterol"""
    return total_cholesterol


def save_user_low_density_lipoprotein(low_density_lipoprotein: float) -> float:
    """Call when user provides their low-density lipoprotein"""
    return low_density_lipoprotein


def save_user_high_density_lipoprotein(high_density_lipoprotein: float) -> float:
    """Call when user provides their high-density lipoprotein"""
    return high_density_lipoprotein


def save_user_triglycerides(triglycerides: float) -> float:
    """Call when user provides their triglycerides"""
    return triglycerides


def save_user_smoking(smoking: bool) -> bool:
    """Call when user provides whether they smoke"""
    return smoking


def save_user_alcohol_consumption(alcohol_consumption: int) -> int:
    """Call when user provides their alcohol consumption"""
    return alcohol_consumption


def save_user_amount_of_sleep(sleep: float) -> float:
    """Call when user provides their amount of sleep"""
    return sleep


def save_user_other_past_medical_conditions(past_conditions: str) -> str:
    """Call when user provides their other past medical conditions"""
    return past_conditions


def save_user_other_current_medical_conditions(current_conditions: str) -> str:
    """Call when user provides their other current medical conditions"""
    return current_conditions


def save_user_exercise_activity(exercise: Literal["sedentary", "lightly active", "moderately active", "very active", "athlete"]) -> str:
    """Call when user provides their exercise activity"""
    return exercise


def save_user_medication(medication: str) -> str:
    """Call when user provides their medication"""
    return medication


def save_user_pregnancy(pregnancy: bool) -> bool:
    """Call when user provides whether they are pregnant"""
    return pregnancy


def save_user_waist_measurement(waist_measurement: int) -> int:
    """Call when user provides their waist measurement"""
    return waist_measurement


def save_user_family_history_with_heart_disease(family_history_with_heart_disease: bool) -> bool:
    """Call when user provides whether they have family history with heart disease"""
    return family_history_with_heart_disease
