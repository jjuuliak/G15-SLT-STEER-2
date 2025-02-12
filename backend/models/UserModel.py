from pydantic import BaseModel, Field, EmailStr, ConfigDict
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated
from typing import Optional

PyObjectId = Annotated[str, BeforeValidator(str)]

class UserModel(BaseModel):
    """
    Model for basic user information
    """

    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    username: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "name": "Matti Meikäläinen",
                "email": "matti.meikalainen@example.com",
                "password": "verysafepwd123",
            }
        },
        extra="forbid"
    )