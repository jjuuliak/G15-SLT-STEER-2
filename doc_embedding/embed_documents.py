from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.vectorstores import FAISS
import faiss
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer
from langchain_huggingface import HuggingFaceEmbeddings
import json
from pathlib import Path
import os
from readabilipy import simple_json_from_html_string
import requests
from bs4 import BeautifulSoup
import time
import re


DOCUMENT_URLS_PATH = Path(os.getenv("DOCUMENT_URLS_PATH", "docs/doc_urls.json"))
DATABASE_PATH = Path(os.getenv("DATABASE_PATH", "embedding_db"))
EMBEDDING_MODEL = "intfloat/multilingual-e5-small"
MODEL_DIR = "/app/embedding_models"


def load_urls(path):
    """Loads and returns urls from JSON file."""
    with open(path) as url_json:
        urls = json.load(url_json)
    return urls


def extract_title(html):
    """Extracts the title from an HTML document."""
    soup = BeautifulSoup(html, 'html.parser')
    title_tag = soup.find("title")
    return title_tag.text.strip() if title_tag else "Untitled Document"

def clean_text(text):
    """Removes unwanted elements like links"""

    # Remove URLs
    cleaned = re.sub(r'https?://\S+|www\.\S+', '', text)

    return cleaned


def load_webpage(url, retries=3, backoff_factor=2):
    """Loads, extracts, and cleans text from a webpage while retrieving its title."""
    
    # Retry requests with exponential backoff
    for attempt in range(retries):
        try:
            response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=5)
            if response.status_code == 200:
                title = extract_title(response.text)
                html = simple_json_from_html_string(response.text, use_readability=True)
                
                if html.get('plain_text'):
                    raw_text = "\n".join([text['text'] for text in html['plain_text']])
                    cleaned_text = clean_text(raw_text)
                    return cleaned_text, title

            print(f"Failed to fetch {url} (Status: {response.status_code})")
        
        except requests.RequestException as e:
            print(f"Attempt {attempt+1} failed for {url}: {e}")
            time.sleep(backoff_factor * (attempt + 1))
    
    return None, None


def chunk_text(text, chunk_size=150, chunk_overlap=30):
    """Token-based chunking, tries to keep paragraphs together."""

    if not text:
        return []
    tokenizer = AutoTokenizer.from_pretrained(EMBEDDING_MODEL)

    def token_length(text_string):
        return len(tokenizer.encode(text_string, add_special_tokens=False))

    # Enforce maximum chunk size, prioritize paragraph-level chunking with sentences and words as a fallback option
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, 
        chunk_overlap=chunk_overlap, 
        length_function=token_length, 
        separators=["\n\n", "\n", ". ", "? ", "! ", " ", ""], 
        is_separator_regex=False, 
    )

    chunks = text_splitter.split_text(text)
    return chunks


def store_in_faiss(vector_store, chunks, metadata_list):
    """Stores text chunks in FAISS along with their metadata."""
    vector_store.add_texts(texts=chunks, metadatas=metadata_list)
    print(f"Stored {len(chunks)} chunks in FAISS with metadata.")


def process_and_store(vector_store, urls):
    """Loads, chunks, embeds, and stores website content with metadata."""
    all_chunks = []
    metadata_list = []

    for url in urls:
        text, title = load_webpage(url)
        if text:
            chunks = chunk_text(text)
            # Include title in chunks
            titled_chunks = [f"Title: {title}\n{chunk}" for chunk in chunks]
            all_chunks.extend(titled_chunks)

            # Add title as metadata for each chunk
            metadata_list.extend([{"title": title, "url": url}] * len(chunks))

    if all_chunks:
        store_in_faiss(vector_store, all_chunks, metadata_list)
    else:
        print("No valid chunks to store.")


def index_exists(path):
    """Check if a FAISS index already exists in the directory."""
    embeddings_file = path / "index.faiss"
    metadata_file = path / "index.pkl"

    return embeddings_file.exists() and metadata_file.exists()


def main():
    if os.getenv("CI_TEST") == "true":
        return

    # Don't run if an index already exists
    if index_exists(DATABASE_PATH):
        print("FAISS index already exists. Skipping embedding process.")
        return
    
    embedding_model = SentenceTransformer(EMBEDDING_MODEL)
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL, cache_folder=MODEL_DIR)

    # Initialize FAISS index based on embedding dimensionality
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