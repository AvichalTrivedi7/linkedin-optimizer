# utils/text_cleaning.py
import re
from typing import List
try:
    import nltk
    nltk.data.find("tokenizers/punkt")
except Exception:
    try:
        import nltk
        nltk.download("punkt", quiet=True)
    except Exception:
        pass

def clean_text(text: str) -> str:
    """Basic cleaning: normalize whitespace and strip."""
    if not text:
        return ""
    text = text.strip()
    text = re.sub(r"\s+", " ", text)
    return text

def extract_hashtags(text: str) -> List[str]:
    """Return list of hashtags found in the text (without #)."""
    if not text:
        return []
    return [h.strip("#") for h in re.findall(r"#\w[\w-]*", text)]

def extract_mentions(text: str) -> List[str]:
    """Return list of @mentions."""
    if not text:
        return []
    return [m.strip("@") for m in re.findall(r"@\w[\w-]*", text)]

def sentence_tokenize(text: str) -> List[str]:
    """Split into sentences; fallback to simple split if nltk missing."""
    text = clean_text(text)
    try:
        from nltk import sent_tokenize
        return sent_tokenize(text)
    except Exception:
        # very simple fallback
        return [s.strip() for s in re.split(r"[.!?]\s+", text) if s.strip()]

def count_words(text: str) -> int:
    return len(clean_text(text).split())

def count_chars(text: str) -> int:
    return len(text) if text else 0
