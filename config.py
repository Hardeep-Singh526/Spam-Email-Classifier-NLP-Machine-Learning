"""
Configuration settings for the AI Spam Email Classifier.
Handles environment variables, directory paths, and ML hyperparameters.
"""

import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()

@dataclass(frozen=True)
class Config:
    # Model & Artifact Paths
    MODEL_DIR: str = "models"
    MODEL_PATH: str = os.path.join(MODEL_DIR, "model.pkl")
    VECTORIZER_PATH: str = os.path.join(MODEL_DIR, "vectorizer.pkl")
    
    # Dataset Config
    DATASET_DIR: str = "dataset"
    DATASET_PATH: str = os.path.join(DATASET_DIR, "spam_collection.csv")
    
    # Gemini AI Config
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL_NAME: str = "gemini-3.6-flash"
    
    # ML Hyperparameters
    MAX_TFIDF_FEATURES: int = 3000
    NGRAM_RANGE: tuple = (1, 2)
    TEST_SIZE: float = 0.20
    RANDOM_STATE: int = 42
    LOGISTIC_C_PARAM: float = 1.5

config = Config()
