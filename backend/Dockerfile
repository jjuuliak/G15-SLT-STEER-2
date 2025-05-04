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

# Stage 2: Backend-specific image
FROM base AS backend

WORKDIR /app

COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]