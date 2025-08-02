from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

# Model for the Card object
class Card(BaseModel):
    card_id: Optional[int] = None
    word: str = ""
    t_word: Optional[str] = None
    description: Optional[str] = None
    pronunciation: Optional[str] = None
    part_of_speech: Optional[str] = None
    synonyms: Optional[str] = None
    sentence: Optional[str] = None
    t_sentence: Optional[str] = None
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
