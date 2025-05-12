# Stage 1: Base image with common dependencies
FROM python:3.13 AS base

WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY base-requirements.txt .

RUN pip install --no-cache-dir -r base-requirements.txt

# Stage 2: Doc Embedding-specific image
FROM base AS doc_embedding

WORKDIR /app

# Install Node.js for ReadabiliPy
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY doc_embedding/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download and save embedding model
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('intfloat/multilingual-e5-small').save('/app/embedding_models/intfloat_multilingual-e5-small')"

# Install JS dependencies inside the installed ReadabiliPy directory
RUN cd /usr/local/lib/python3.13/site-packages/readabilipy/javascript && npm install
ENV NODE_PATH=/usr/local/lib/python3.13/site-packages/readabilipy/javascript/node_modules

COPY doc_embedding/ .

CMD ["python", "embed_documents.py"]
