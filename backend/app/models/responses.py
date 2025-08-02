from pydantic import BaseModel
from typing import Optional, Any, Dict, List
from enum import Enum

# Response models for various endpoints

class ResponseStatus(str, Enum):
    SUCCESS = "success"
    ERROR = "error"

class BaseResponse(BaseModel):
    status: ResponseStatus
    message: str
    data: Optional[Any] = None

class SentenceResponse(BaseResponse):
    """Response model for sentence analysis"""
    data: Optional[str] = None
    session_id: Optional[str] = None 
    
class CardResponse(BaseResponse):
    """Response model for single card generation"""
    data: Optional[Dict] = None

class MultipleCardResponse(BaseResponse):
    """Response model for multiple card generation"""
    data: Optional[List[Dict]] = None