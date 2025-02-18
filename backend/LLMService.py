import os
from typing import Dict

import google.generativeai as genai
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pydantic import SecretStr


EMBEDDINGS_FILE = "cache/embeddings.faiss"


class LLMService:

    def __init__(self, api_key: str, model_name: str = 'gemini-1.5-flash'):
        """
        Initialize LLMService with API key and the model
        """
        genai.configure(api_key=api_key)
        self.model_name = model_name
        self.sessions: Dict[str, genai.ChatSession] = {}

        global embedding_model
        embedding_model = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004",
                                                       google_api_key=SecretStr(api_key))

        if not os.path.exists(EMBEDDINGS_FILE):
            text = ""
            for filename in os.listdir("/data"):
                if filename.endswith(".txt"):
                    with open(os.path.join("/data", filename), 'r', encoding='utf-8') as file:
                        text += file.read() + "\n"

            if len(text) == 0:
                raise ValueError("No text found in /data/*.txt")

            FAISS.from_texts(RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100).split_text(text),
                             embedding_model).save_local(EMBEDDINGS_FILE)

        global embeddings
        embeddings = FAISS.load_local(EMBEDDINGS_FILE, embedding_model, allow_dangerous_deserialization=True)


    def get_session(self, user_id: str) -> genai.ChatSession:
        """
        Retrieve user's chat session or create a new one if they haven't started one yet
        """
        if user_id not in self.sessions:
            model = genai.GenerativeModel(
                self.model_name, 
                system_instruction=["""You are a helpful cardiovascular health expert, 
                    who focuses on lifestyle changes and can answer questions in 
                    Finnish or English depending on the question's language. DO NOT HALLUCINATE OR ANSWER NON RELATED
                    QUESTIONS"""])
            self.sessions[user_id] = model.start_chat()
        return self.sessions[user_id]


    def send_message(self, user_id: str, message: str) -> str:
        session = self.get_session(user_id)

        documents = embeddings.similarity_search(message)

        print(documents)

        context = ""
        for d in documents:
            context += d.page_content + " "

        combined_message = f"User asks a question:\n{message}\n\nAdditional context only for you:\n{context}"

        response = session.send_message(combined_message)
        return response.text if response else "Error: No response from model."
