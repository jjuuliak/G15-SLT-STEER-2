from pydantic import BaseModel

class QueryEnhancement(BaseModel):
    """
    Model for query enhancement step
    """
    rewritten_query: str
    requires_retrieval: bool
