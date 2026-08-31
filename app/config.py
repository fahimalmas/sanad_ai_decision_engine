import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from project root or current dir
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

class Settings:
    APP_NAME: str = "Sanad AI - Enterprise Grounded Decision Engine"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    DEBUG: bool = True
    
    # LLM Provider Options: 'gemini' (Cloud), 'ollama' (100% Local On-Premises), or 'local'
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini").lower()
    
    # Model Tiering & Selection
    # Options: 'flash' (Sub-second RAG), 'pro' (Deep Legal Reasoning), 'thinking' (Chain-of-Thought)
    MODEL_TIER: str = os.getenv("MODEL_TIER", "flash").lower()
    
    # Google Gemini Settings (Cloud Provider)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "text-embedding-004")
    TEMPERATURE: float = float(os.getenv("TEMPERATURE", "0.0"))
    
    # Security & Guardrails
    SECURITY_STRICT_MODE: bool = os.getenv("SECURITY_STRICT_MODE", "true").lower() == "true"
    
    # Local / On-Premise Ollama Settings (Zero Data Leakage)
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    LOCAL_MODEL_NAME: str = os.getenv("LOCAL_MODEL_NAME", "gemma2:9b")
    
    # Available Supported Model Catalog
    SUPPORTED_MODELS: dict = {
        "flash": "gemini-2.0-flash",
        "pro": "gemini-2.0-pro-exp",
        "thinking": "gemini-2.0-flash-thinking-exp",
        "local": "gemma2:9b"
    }
    
    # Storage Paths
    BASE_DIR: Path = BASE_DIR
    DATA_DIR: Path = BASE_DIR / "data"
    UPLOADS_DIR: Path = BASE_DIR / "data" / "uploads"
    CHROMA_DIR: Path = BASE_DIR / "data" / "chroma_db"
    SAMPLE_DATA_DIR: Path = BASE_DIR / "app" / "sample_data"
    STATIC_DIR: Path = BASE_DIR / "app" / "static"

settings = Settings()

# Ensure directories exist
settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
settings.UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
settings.CHROMA_DIR.mkdir(parents=True, exist_ok=True)
settings.SAMPLE_DATA_DIR.mkdir(parents=True, exist_ok=True)
