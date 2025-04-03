from typing import Literal

from pydantic import Field, BaseModel


class ChatModel(BaseModel):
    message: str = Field(...)
    language: Literal["English", "Finnish"] = Field(...)
