import os

from openai import OpenAI


LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.avalai.ir/v1")
LLM_API_KEY = os.getenv("LLM_API_KEY")

OPENAI_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
OPENAI_SUMMARY_MODEL = os.getenv("LLM_SUMMARY_MODEL", "gpt-4o-mini")
OPENAI_EMBEDDING_MODEL = os.getenv(
    "LLM_EMBEDDING_MODEL",
    "text-embedding-3-large",
)

if not LLM_API_KEY:
    raise RuntimeError(
        "LLM_API_KEY is not configured. Copy backend/.env.example to "
        "backend/.env and provide a valid API key."
    )

client = OpenAI(
    base_url=LLM_BASE_URL,
    api_key=LLM_API_KEY,
)