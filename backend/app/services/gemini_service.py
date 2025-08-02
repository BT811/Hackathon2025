import google.generativeai as genai
from app.config.settings import get_settings
from app.models.card import Card
import json
import asyncio
import uuid
from datetime import datetime, timedelta
import threading
settings = get_settings()
GLOBAL_CHAT_SESSIONS = {}
SESSION_TIMEOUT = 300  
import time

class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.generation_model = genai.GenerativeModel(model_name="gemini-2.0-flash") 
        self.chat_sessions = GLOBAL_CHAT_SESSIONS
        
        self._start_cleanup_thread()
    
    # Start a background thread to clean up old sessions
    # This will run every minute to remove sessions that have been inactive for too long
    def _start_cleanup_thread(self):
        def cleanup_old_sessions():
            while True:
                current_time = time.time()
                sessions_to_remove = []
                
                for session_id, session_data in GLOBAL_CHAT_SESSIONS.items():
                    if current_time - session_data['timestamp'] > SESSION_TIMEOUT:
                        sessions_to_remove.append(session_id)
                
                for session_id in sessions_to_remove:
                    del GLOBAL_CHAT_SESSIONS[session_id]
                    print(f"Session expired and removed: {session_id}")
                
                if sessions_to_remove:
                    print(f"Cleaned up {len(sessions_to_remove)} expired sessions. Active sessions: {len(GLOBAL_CHAT_SESSIONS)}")
                
                time.sleep(60)  
        
        cleanup_thread = threading.Thread(target=cleanup_old_sessions, daemon=True)
        cleanup_thread.start()
    
    # Generate a language card for a given word and context sentence
    async def generate_card(self, word: str, n_language: str, l_language: str = "English", sentence: str = None) -> Card:
        
        prompt = f"""Create a language card for the word '{word}', user native language is '{n_language}' and learning '{l_language}'. 
        {f'in the context: {sentence}' if sentence else ''}.Correct the misspelled parts in the sentence and create the card based on it.
        
        Return a JSON response with these fields:
        - word (original word)
        - t_word (translation of the word)
        - synonyms (original synonyms, comma separated)
        - description (Explain in the user's native language. Show the general meaning of the given word and the meaning it creates in the sentence.)
        - sentence (Sentence provided by user, If a long fragment appears, return only the sentence containing the word.)
        - t_sentence (translated sentence in the user's native language)
        - pronunciation (phonetic pronunciation)
        - part_of_speech (word is it a noun, verb, etc.)

        Response must be valid JSON format. Only return the JSON object, no extra text or markdown.
        """
        try:
            response = await self.generation_model.generate_content_async(contents=[prompt])
            raw_response_text = response.text.strip()
            
            if raw_response_text.startswith('```json') and raw_response_text.endswith('```'):
                json_str = raw_response_text[len('```json'):-len('```')].strip()
            else:
                json_str = raw_response_text.strip()
            
            parsed_data = json.loads(json_str)
            return Card(**parsed_data)
        except Exception as e:
            print(f"Error generating card: {e}")
            return Card(word=word, t_word="Error", description=str(e))

    # Analyze a sentence using a specific word and provide feedback
    async def sentence_response(self, word: str, sentence: str, n_language: str = "Turkish", l_language: str = "English", session_id: str = None) -> str:
      
        prompt = f"""
        You are a language teaching assistant. You will analyze the sentence created by the user with a certain word.
        The user's native language is '{n_language}' and they are learning '{l_language}'.
        They used the word '{word}' in the sentence: '{sentence}'.Prepare an answer for the student.
        Must include:
        Your first task is to analyze this sentence. Your response MUST be in the user's native language ('{n_language}').
        1.  Start by checking the sentence for grammatical errors and correcting them. Explain the corrections clearly.
        2.  Evaluate if the word '{word}' is used correctly in the context of the sentence. If not, explain why and provide a better alternative.
        3.  Provide two alternative example sentences using the word '{word}', showing both the '{l_language}' version and its '{n_language}' translation.
        4.  After your analysis, ask an open-ended question to encourage the user to continue the conversation, for example: "Aklına takılan başka bir şey var mı?".
        """
        
        chat = self.generation_model.start_chat(history=[])

        if session_id is None:
            session_id = str(uuid.uuid4())

        GLOBAL_CHAT_SESSIONS[session_id] = {
                'chat': chat,
                'timestamp': time.time()
            }

        
        try:
            response = await chat.send_message_async(prompt)
            return {
                "data": response.text,
                "session_id": session_id
            }
        except Exception as e:
            return f"Error providing sentence response: {str(e)}"

    # Start a chat session with sentence analysis
    async def continue_chat(self, session_id: str, user_message: str) -> str:
        print(f"Looking for session: {session_id}")
        print(f"Available sessions: {list(GLOBAL_CHAT_SESSIONS.keys())}")
        
        if session_id not in GLOBAL_CHAT_SESSIONS:
            return "Session not found or expired. Please start a new chat session."

        session_data = GLOBAL_CHAT_SESSIONS[session_id]
        chat = session_data['chat']
        
        session_data['timestamp'] = time.time()
        
        try:
            response = await chat.send_message_async(user_message)
            return response.text
        except Exception as e:
            return f"Error occurred while continuing the chat: {str(e)}"


