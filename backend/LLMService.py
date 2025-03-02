import google.generativeai as genai
from typing import Dict
from rag_service import RAGService
import chat_history

rag = RAGService()

class LLMService:
    def __init__(self, api_key: str, model_name: str = 'gemini-1.5-flash'):
        """
        Initialize LLMService with API key and the model
        """
        genai.configure(api_key=api_key)
        self.model_name = model_name
        self.sessions: Dict[str, genai.ChatSession] = {}
        self.prompt_correction_model = genai.GenerativeModel(
            self.model_name,
            system_instruction=["""You are an assistant that corrects spelling, 
                                grammatical, and punctuation errors in the user's
                                prompt. Return only the corrected version of the
                                prompt, without any additional text or explanation."""]
        )


    async def get_session(self, user_id: str) -> genai.ChatSession:
        """
        Retrieve user's chat session or create a new one if they haven't started one yet
        """
        if user_id not in self.sessions:
            model = genai.GenerativeModel(
                self.model_name,
                system_instruction=["""You are a helpful cardiovascular health expert, 
                        who focuses on lifestyle changes and can answer questions in 
                        Finnish or English depending on the question's language."""])
            self.sessions[user_id] = model.start_chat(history=await chat_history.load_history(user_id))
        return self.sessions[user_id]


    async def send_message(self, user_id: str, message: str) -> str:
        session = await self.get_session(user_id)

        rag_prompt = rag.build_prompt(message)
        response = session.send_message(rag_prompt)
        if response:
            chat_history.store_history(user_id, message, response.text)
            return response.text
        else:
            return "Error: No response from model."


    def correct_prompt(self, prompt: str) -> str:
        """
        Fixes spelling, grammatical and punctuation errors in the user given prompt
        """
        response = self.prompt_correction_model.generate_content(prompt)
        return response.text if response else None