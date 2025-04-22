FROM python:3.13

WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY base-requirements.txt .

RUN --mount=type=cache,target=/root/.cache/pip pip install -r base-requirements.txt
