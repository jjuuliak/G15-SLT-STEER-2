from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.vectorstores import FAISS
import faiss
from sentence_transformers import SentenceTransformer
from langchain_huggingface import HuggingFaceEmbeddings
import re
import json

DOCUMENT_URLS_PATH = "docs/doc_urls.json"
DATABASE_PATH = "embedding_db"
EMBEDDING_MODEL = "intfloat/multilingual-e5-small"

def load_urls(path):
    """Loads and returns urls from JSON file."""
    with open(path) as url_json:
        urls = json.load(url_json)
    return urls

def clean_text(text):
    """Cleans extracted webpage text by removing excessive newlines, tabs, and extra spaces."""
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'\t+', ' ', text)
    text = re.sub(r' +', ' ', text)
    return text.strip()

def load_webpage(url):
    """Loads, extracts, and cleans text from a webpage using LangChain's WebBaseLoader."""
    loader = WebBaseLoader(url)
    docs = loader.load()

    # Join all document content and clean it
    raw_text = "\n\n".join([doc.page_content for doc in docs])
    cleaned_text = clean_text(raw_text)
    return cleaned_text

def chunk_text(text, chunk_size=500, chunk_overlap=100):
    """Splits text into chunks without breaking sentences."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap, separators=["\n\n", "\n", " ", ""]
    )
    return text_splitter.split_text(text)

def store_in_faiss(vector_store, chunks):
    """Stores text chunks in FAISS (auto-embedding enabled)."""
    vector_store.add_texts(chunks)
    print(f"Stored {len(chunks)} chunks in FAISS.")

def process_and_store(vector_store, urls):
    """Loads, chunks, embeds, and stores website content."""
    all_chunks = []

    for url in urls:
        text = load_webpage(url)
        if text:
            chunks = chunk_text(text)
            all_chunks.extend(chunks)

    if all_chunks:
        store_in_faiss(vector_store, all_chunks)
    else:
        print("No valid chunks to store.")

def main():
    embedding_model = SentenceTransformer(EMBEDDING_MODEL)
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

    # Initialize FAISS index and flatten it based on the embedding vectors' dimensionality
    index = faiss.IndexFlatIP(embedding_model.get_sentence_embedding_dimension())

    # LangChain's FAISS wrapper
    vector_store = FAISS(
        embedding_function=embeddings,
        index=index,
        docstore=InMemoryDocstore(),
        index_to_docstore_id={},
    )

    urls = load_urls(DOCUMENT_URLS_PATH)
    process_and_store(vector_store, urls)
    vector_store.save_local(DATABASE_PATH)

if __name__ == "__main__":
    main()