from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import chat, create_card
from app.config.settings import get_settings
import logging

# Logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_application() -> FastAPI:
    
    app = FastAPI(
        title="Flash Card API",
        description="AI-powered language learning flashcard generator",
        version="1.0.0"
    )
    
    # CORS middleware for frontend
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(create_card.router, prefix="/api/cards", tags=["cards"])
    app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
    
    return app

app = create_application()

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Flash Card API",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "flash-card-api"}