from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from pathlib import Path

DATABASE_PATH = Path(__file__).resolve().parent.parent / 'doc_embedding' / 'embedding_db'
EMBEDDING_MODEL = "intfloat/multilingual-e5-small"

class RAGService:
    def __init__(self):
        """
        Initializes the service with the stored vector store or None
        if it doesn't exist
        """
        embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
        try:
            self.vector_store = FAISS.load_local(DATABASE_PATH, embeddings, 
                                                 allow_dangerous_deserialization=True)
        except:
            self.vector_store = None

    def retrieve_relevant_chunks(self, query, top_k=3):
        """
        Retrieves top_k number of relevant chunks for the given query
        """
        if self.vector_store == None:
            return None 
        
        results = self.vector_store.similarity_search_with_score(query=query, k=top_k)
        contents = [doc.page_content for doc, _ in results]

        return contents