from pydantic import BaseModel, Field, ConfigDict, BeforeValidator
from typing_extensions import Annotated
from typing import Optional, Literal

PyObjectId = Annotated[str, BeforeValidator(str)]

class MedicalInfo(BaseModel):
    """
    Model for user medical information
    """

    id: Optional[PyObjectId] = Field(alias="_id", default=None, exclude=True)
    user_id: Optional[PyObjectId] = Field(default=None, exclude=True)
    name: Optional[str] = Field(default=None)
    age: Optional[int] = Field(default=None)
    weight_kg: Optional[int] = Field(default=None)
    height_cm: Optional[float] = Field(default=None)
    gender: Optional[Literal["male", "female", "other"]] = Field(default=None)
    systolic_blood_pressure_mmhg: Optional[list[int]] = Field(default=None)
    diastolic_blood_pressure_mmhg: Optional[list[int]] = Field(default=None)
    heart_rate_resting_bpm: Optional[list[int]] = Field(default=None)
    total_cholesterol_mmoll: Optional[list[float]] = Field(default=None)
    low_density_lipoprotein_mmoll: Optional[list[float]] = Field(default=None)
    high_density_lipoprotein_mmoll: Optional[list[float]] = Field(default=None)
    triglycerides_mmoll: Optional[list[float]] = Field(default=None)
    smoking: Optional[bool] = Field(default=None)
    alcohol_consumption_drinks_per_week: Optional[int] = Field(default=None)
    sleep_daily_avg: Optional[float] = Field(default=None)
    other_past_medical_conditions: Optional[list[str]] = Field(default=None)
    other_current_medical_conditions: Optional[list[str]] = Field(default=None)
    exercise_level: Optional[Literal["sedentary", "lightly active", "moderately active", "very active", "athlete"]] = Field(default=None)
    medication: Optional[list[str]] = Field(default=None)
    pregnancy: Optional[bool] = Field(default=None)
    waist_measurement_cm: Optional[int] = Field(default=None)
    family_history_with_heart_disease: Optional[bool] = Field(default=None)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        extra="forbid",
        json_schema_extra={
            "example": {
                "user_id": "user123s_mongo_id",
                "smoking": False
            }
        }
    )