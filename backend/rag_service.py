from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from pathlib import Path
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from pathlib import Path

DATABASE_PATH = Path("/app/embedding_db") 
EMBEDDING_MODEL = "intfloat/multilingual-e5-small"
MODEL_DIR = "/app/embedding_models"

class RAGService:
    def __init__(self):
        """
        Initializes the service with the stored vector store or None
        if it doesn't exist
        """
        embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL, cache_folder=MODEL_DIR)
        try:
            self.vector_store = FAISS.load_local(DATABASE_PATH, embeddings, 
                                                 allow_dangerous_deserialization=True)
        except:
            self.vector_store = None

    def retrieve_relevant_chunks(self, query, top_k):
        """
        Retrieves top_k number of relevant chunks for the given query
        """
        if self.vector_store == None:
            return None 
        
        results = self.vector_store.similarity_search_with_score(query=query, k=top_k)
        contents = [doc.page_content for doc, _ in results]

        return contents
    
    def build_prompt(self, query, top_k=5):
        """
        Builds the final prompt by combining the user's query with retrieved context.
        """
        context_chunks = self.retrieve_relevant_chunks(query, top_k)

        if not context_chunks:
            context_text = "No additional context."
        else:
            context_text = "\n\n".join(context_chunks)

        print(f"Query: {query}\nContext: {context_text}")

        prompt = f"""
            Use only the provided context and previous conversation history to provide an answer to the user. If the query cannot be answered with the context 
            or the conversation history, politely ask the user to try another query relating to your expertise. Provide your answer as if you already knew the provided context, 
            and don't make any additional remarks about the context.

            Context:
            {context_text}

            User's query:
            {query}

            Answer in a detailed but clear way.
            """
        return prompt