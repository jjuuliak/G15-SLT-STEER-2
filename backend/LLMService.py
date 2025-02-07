import google.generativeai as genai
from typing import Dict

class LLMService:
    def __init__(self, api_key: str, model_name: str = 'gemini-1.5-flash'):
        """
        Initialize LLMService with API key and the model
        """
        genai.configure(api_key=api_key)
        self.model_name = model_name
        self.sessions: Dict[str, genai.ChatSession] = {}
    
    def get_session(self, user_id: str) -> genai.ChatSession:
        """
        Retrieve user's chat session or create a new one if they haven't started one yet
        """
        if user_id not in self.sessions:
            model = genai.GenerativeModel(
                self.model_name, 
                system_instruction=["""You are a helpful cardiovascular health expert, 
                    who focuses on lifestyle changes and can answer questions in 
                    Finnish or English depending on the question's language."""])
            self.sessions[user_id] = model.start_chat()
        return self.sessions[user_id]
    
    def send_message(self, user_id: str, message: str) -> str:
        session = self.get_session(user_id)
        response = session.send_message(message)
        return response.text if response else "Error: No response from model."
    