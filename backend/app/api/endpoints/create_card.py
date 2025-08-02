from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File, Form, Body
from typing import List
from app.services.create_card_service import CreateCardService 

router = APIRouter()
# Endpoint for creating cards from images
@router.post("/image")
async def extract_sentences(
    image: UploadFile = File(...),
    words: List[str] = Form(...),
    n_language: str = Form("Turkish"), 
    l_language: str = Form("English"),
):  

    try:
        create_card_service = CreateCardService()
        image_content = await image.read()
        result = await create_card_service.process_image_and_create_cards(
            image_content=image_content, 
            words=words,
            n_language=n_language,
            l_language=l_language
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )
    
# Endpoint for creating cards from text
@router.post("/text")
async def extract_sentences(
    request: Request,
    text: str = Body(...),
    words: List[str] = Body(...),
    n_language: str = Body("Turkish"),  
    l_language: str = Body("English"), 
): 
    
    try:
        create_card_service = CreateCardService()
        result = await create_card_service.process_text_and_create_cards(
            text=text, 
            words=words,
            n_language=n_language,
            l_language=l_language
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing Text: {str(e)}"
        )