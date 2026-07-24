"""
Utility functions for text cleaning, regex sanitation, tokenization,
stemming/lemmatization, and feature extraction.
"""

import re
import string
import logging
from typing import List, Tuple, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def clean_text(raw_text: str) -> str:
    """
    Standard NLP text sanitation pipeline:
    1. Lowercasing
    2. URL & HTML Tag stripping
    3. Punctuation and digit removal
    4. Whitespace normalization
    """
    if not isinstance(raw_text, str) or not raw_text.strip():
        return ""

    # Convert to lowercase
    text = raw_text.lower()
    
    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    
    # Remove HTML tags
    text = re.sub(r'<.*?>', '', text)
    
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    
    # Remove numbers/digits
    text = re.sub(r'\d+', '', text)
    
    # Normalize extra spaces
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def extract_structural_features(raw_text: str) -> Dict[str, Any]:
    """
    Extracts structural email attributes used for heuristic threat scoring.
    """
    if not raw_text:
        return {
            "char_count": 0,
            "word_count": 0,
            "has_url": False,
            "is_shortened_url": False,
            "uppercase_ratio": 0.0,
            "exclamation_count": 0,
            "dollar_count": 0
        }
        
    char_count = len(raw_text)
    words = raw_text.strip().split()
    word_count = len(words)
    
    has_url = bool(re.search(r'https?://|[a-z0-9]+\.[a-z]{2,3}', raw_text, re.IGNORECASE))
    is_shortened_url = bool(re.search(r'bit\.ly|tinyurl|goo\.gl|t\.co|is\.gd', raw_text, re.IGNORECASE))
    
    uppercase_chars = len(re.findall(r'[A-Z]', raw_text))
    uppercase_ratio = round((uppercase_chars / (char_count or 1)) * 100, 1)
    
    exclamation_count = raw_text.count('!')
    dollar_count = raw_text.count('$')
    
    return {
        "char_count": char_count,
        "word_count": word_count,
        "has_url": has_url,
        "is_shortened_url": is_shortened_url,
        "uppercase_ratio": uppercase_ratio,
        "exclamation_count": exclamation_count,
        "dollar_count": dollar_count
    }
