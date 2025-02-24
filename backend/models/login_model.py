from pydantic import BaseModel, Field, EmailStr, ConfigDict

class UserLogin(BaseModel):
    """
    Model for user login information
    """

    email: EmailStr = Field(...)
    password: str = Field(...)
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "example": {
                "email": "matti.meikalainen@example.com",
                "password": "verysafepwd123",
            }
        }
    )