from pydantic import Field, BaseModel


class HistoryRequestModel(BaseModel):
    # Index of the first message to get, 0 is the last response from AI and 1 is the last question
    start_index: int = Field(...)
    count: int = Field(...)
