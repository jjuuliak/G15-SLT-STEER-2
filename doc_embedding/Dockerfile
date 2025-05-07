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

# Node.js install for readabilipy
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY doc_embedding/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY doc_embedding/ .

CMD ["python", "embed_documents.py"]