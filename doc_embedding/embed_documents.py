from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.vectorstores import FAISS
import faiss
from sentence_transformers import SentenceTransformer
from langchain_huggingface import HuggingFaceEmbeddings
import json
from pathlib import Path
import os
from readabilipy import simple_json_from_html_string
import requests
from bs4 import BeautifulSoup

DOCUMENT_URLS_PATH = Path(os.getenv("DOCUMENT_URLS_PATH", "docs/doc_urls.json"))
DATABASE_PATH = Path(os.getenv("DATABASE_PATH", "embedding_db"))
EMBEDDING_MODEL = "intfloat/multilingual-e5-small"
MODEL_DIR = "/app/embedding_models"

def load_urls(path):
    """Loads and returns urls from JSON file."""
    with open(path) as url_json:
        urls = json.load(url_json)
    return urls

def clean_html(html):
    soup = BeautifulSoup(html, 'html.parser')

    # Remove certain tags from the HTML
    for tag in soup(["nav", "footer", "aside", "header"]):
        tag.decompose()

    # Get the plain text from the remaining HTML
    plain_text = soup.get_text(separator='\n', strip=True)
    print(plain_text)
    return plain_text

def load_webpage(url):
    """Loads, extracts, and cleans text from a webpage"""

    # Gets HTML
    response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = simple_json_from_html_string(response.text, use_readability=True)


    if html.get('plain_text') is not None:
        raw_text = "\n".join([text['text'] for text in html['plain_text']])
    else:
        return None
    
    return raw_text

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

def index_exists(path):
    """Check if a FAISS index already exists in the directory."""
    embeddings_file = path / "index.faiss"
    metadata_file = path / "index.pkl"

    return embeddings_file.exists() and metadata_file.exists()

def main():
    # Don't run if an index already exists. TODO: 
    if index_exists(DATABASE_PATH):
        print("FAISS index already exists. Skipping embedding process.")
        return
    
    embedding_model = SentenceTransformer(EMBEDDING_MODEL)
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL, cache_folder=MODEL_DIR)

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