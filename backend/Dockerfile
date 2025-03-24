FROM python:3.13
WORKDIR /app
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt
COPY . .
ENV HF_HOME=/embedding_models
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
