from pydantic import BaseModel, Field, ConfigDict, BeforeValidator
from typing_extensions import Annotated
from typing import Optional

PyObjectId = Annotated[str, BeforeValidator(str)]

class MedicalInfo(BaseModel):
    """
    Model for user medical information
    """

    id: Optional[PyObjectId] = Field(alias="_id", default=None, exclude=True)
    user_id: Optional[PyObjectId] = Field(default=None, exclude=True)
    age: Optional[int] = Field(default=None)
    weight: Optional[int] = Field(default=None)
    height: Optional[float] = Field(default=None)
    gender: Optional[str] = Field(default=None)
    smoking: Optional[bool] = Field(default=None)
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