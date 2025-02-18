from pydantic import BaseModel, Field, EmailStr, ConfigDict, BeforeValidator
from typing_extensions import Annotated
from typing import Optional

PyObjectId = Annotated[str, BeforeValidator(str)]

class User(BaseModel):
    """
    Model for basic user information
    """

    id: Optional[PyObjectId] = Field(alias="_id", default=None, exclude=True)
    name: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        extra="forbid",
        json_schema_extra={
            "example": {
                "name": "matti",
                "email": "matti.meikalainen@example.com",
                "password": "verysafepwd123hashed",
            }
        }
    )