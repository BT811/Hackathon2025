from pydantic import BaseModel, Field
from typing import Optional, List
from fastapi import UploadFile

# Request models for various endpoints

class SentenceRequest(BaseModel):
    word: str = Field(..., min_length=1, description="Word to analyze")
    sentence: str = Field(..., min_length=1, description="User's sentence")
    n_language: str = Field(..., description="Native language (e.g: Turkish)")
    l_language: str = Field(default="English", description="Learning language")

class ImageCardRequest(BaseModel):
    """Request model for image-based card creation"""
    words: List[str] = Field(..., description="List of words to create cards for")
    n_language: str = Field(default="Turkish", description="Native language")
    l_language: str = Field(default="English", description="Learning language")

class TextCardRequest(BaseModel):
    """Request model for text-based card creation"""
    text: str = Field(..., min_length=1, description="Text content to extract sentences from")
    words: List[str] = Field(..., description="List of words to create cards for")
    n_language: str = Field(default="Turkish", description="Native language")
    l_language: str = Field(default="English", description="Learning language")

class ContinueChatRequest(BaseModel):
    session_id: str = Field(..., description="Session ID for continuing chat")
    message: str = Field(..., min_length=1, description="User's message")