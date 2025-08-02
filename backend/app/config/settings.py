import os
from functools import lru_cache

# Configuration settings for the application
class Settings:
    def __init__(self):
        self.GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
        if not self.GEMINI_API_KEY:
            # .env dosyasından oku
            env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
            if os.path.exists(env_file):
                with open(env_file) as f:
                    for line in f:
                        if line.startswith("GEMINI_API_KEY="):
                            self.GEMINI_API_KEY = line.split("=", 1)[1].strip()
                            break
        
        if not self.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not found in environment or .env file")

@lru_cache()
def get_settings():
    return Settings()