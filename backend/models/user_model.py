from pydantic import BaseModel, Field, EmailStr, ConfigDict, BeforeValidator
from typing_extensions import Annotated
from typing import Optional
import bcrypt

PyObjectId = Annotated[str, BeforeValidator(str)]

class UserModel(BaseModel):
    """
    Model for basic user information
    """

    id: Optional[PyObjectId] = Field(alias="_id", default=None, exclude=True)
    #username: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        extra="forbid",
        json_schema_extra={
            "example": {
                "username": "Matti Meikäläinen",
                "email": "matti.meikalainen@example.com",
                "password": "verysafepwd123",
            }
        }
    )

    # Utility functions for user-related operations
    
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hashes the given password
        """

        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode()

    @staticmethod
    def check_password(password: str, hash: str) -> bool:
        """
        Checks if the given password matches the user's stored password hash
        """

        return bcrypt.checkpw(password.encode("utf-8"), hash.encode("utf-8"))

        