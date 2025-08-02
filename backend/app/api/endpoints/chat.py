from fastapi import APIRouter, HTTPException
from app.services.gemini_service import GeminiService
from app.models.requests import SentenceRequest, ContinueChatRequest
from app.models.responses import SentenceResponse, ResponseStatus
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/check-sentence", response_model=SentenceResponse)
async def check_sentence(request: SentenceRequest):

    # Analyzes user's sentence and provides feedback
    
    try:
        logger.info(f"Starting sentence analysis - Word: {request.word}")
        
        gemini_service = GeminiService()
        response = await gemini_service.sentence_response(
            word=request.word,
            sentence=request.sentence,
            n_language=request.n_language,
            l_language=request.l_language
        )
        
        return SentenceResponse(
            status=ResponseStatus.SUCCESS,
            message="Sentence analyzed successfully",
            data=response["data"],
            session_id=response["session_id"]
        )
        
    except Exception as e:
        logger.error(f"Sentence analysis error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error during sentence analysis: {str(e)}"
        )

@router.post("/continue", response_model=SentenceResponse)
async def continue_chat(request: ContinueChatRequest):

    # Continues an existing chat session with a new user message

    try:
        logger.info(f"Continuing chat session - Session ID: {request.session_id}")
        
        gemini_service = GeminiService()
        response = await gemini_service.continue_chat(
            session_id=request.session_id,
            user_message=request.message
        )
        
        return SentenceResponse(
            status=ResponseStatus.SUCCESS,
            message="Chat continued successfully",
            data=response,
            session_id=request.session_id 
        )
        
    except Exception as e:
        logger.error(f"Error continuing chat: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error continuing chat: {str(e)}"
        )