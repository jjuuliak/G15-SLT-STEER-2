from pydantic import Field, BaseModel


class ChatModel(BaseModel):
    message: str = Field(...)
