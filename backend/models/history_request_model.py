from pydantic import Field, BaseModel


class HistoryRequestModel(BaseModel):
    """
    Model for chat history requests
    """

    # Index of the first message to get, 0 is the last response from AI and 1 is the last question
    start_index: int = Field(...)
    # Max how many messages to get
    count: int = Field(...)
