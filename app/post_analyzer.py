# app/post_analyzer.py
"""
Post analysis module.
- provides: analyze_post(text) -> dict
- tries to use sentence-transformers for embeddings;
  optionally uses llama-cpp-python for rewrite suggestions if available.
"""

from typing import Dict, List
from utils.text_cleaning import (
    clean_text, extract_hashtags, sentence_tokenize, count_words, count_chars
)
import math

# optional libs
try:
    import textstat
except Exception:
    textstat = None

try:
    from sentence_transformers import SentenceTransformer, util
    _SENTENCE_MODEL = SentenceTransformer("all-MiniLM-L6-v2")
except Exception:
    _SENTENCE_MODEL = None

# Lazy LLM importer (used for rewrites if available)
def get_llm(model_path: str = "models/mistral-7b-instruct-v0.1.Q4_K_M.gguf"):
    try:
        from llama_cpp import Llama
        return Llama(model_path=model_path, n_ctx=2048, n_threads=4)
    except Exception:
        return None

def readability_score(text: str) -> float:
    """Return normalized 0-100 readability (higher = easier)."""
    text = clean_text(text)
    if not text:
        return 0.0
    if textstat:
        try:
            score = textstat.flesch_reading_ease(text)
            # Normalize roughly: typical Flesch range (0-100). Clip.
            return max(0.0, min(100.0, score))
        except Exception:
            pass
    # fallback: simple heuristic (shorter sentences = easier)
    sents = sentence_tokenize(text)
    avg_len = sum(len(s.split()) for s in sents) / max(1, len(sents))
    # map avg_len 10->100, 40->0
    return max(0.0, min(100.0, 100 - (avg_len - 10) * 3))

def structure_score(text: str) -> float:
    """Check paragraphs, hook, CTA, line breaks. Return 0-100."""
    text = clean_text(text)
    if not text:
        return 0.0
    sents = sentence_tokenize(text)
    score = 0.0
    # Hook check: first sentence length and presence of keywords
    first = sents[0] if sents else ""
    if 5 <= len(first.split()) <= 25:
        score += 25
    # paragraphing
    if "\n" in text or len(sents) >= 3:
        score += 20
    # CTA presence
    ctas = ["dm", "comment", "share", "like", "follow", "connect", "visit"]
    if any(w in text.lower() for w in ctas):
        score += 20
    # storytelling words
    story_triggers = ["story", "learned", "today i", "this happened", "i was"]
    if any(t in text.lower() for t in story_triggers):
        score += 15
    # sentence variety
    if len(sents) > 1:
        score += 10
    return min(100.0, score)

def hashtag_score(text: str) -> float:
    tags = extract_hashtags(text)
    if not tags:
        return 0.0
    # prefer 3-7 hashtags
    n = len(tags)
    if 3 <= n <= 7:
        return 100.0
    if n < 3:
        return 50.0
    return 70.0

def novelty_score(text: str, top_topics: List[str] = None) -> float:
    """Estimate novelty using embedding similarity to topic list (optional)."""
    text = clean_text(text)
    if not text:
        return 0.0
    if _SENTENCE_MODEL is None or not top_topics:
        # fallback: reward medium length
        words = count_words(text)
        return max(0.0, min(100.0, 100 - abs(words - 60)))
    # semantic novelty: lower similarity to common topics -> higher novelty
    emb_text = _SENTENCE_MODEL.encode(text, convert_to_tensor=True)
    sims = []
    for t in top_topics:
        emb_t = _SENTENCE_MODEL.encode(t, convert_to_tensor=True)
        sims.append(float(util.cos_sim(emb_text, emb_t).max()))
    if not sims:
        return 50.0
    mean_sim = sum(sims) / len(sims)
    # similarity in [-1,1] -> map to novelty 0-100 (lower sim = more novel)
    novelty = max(0.0, min(100.0, (1.0 - mean_sim) * 50 + 50))
    return novelty

def simple_sentiment_score(text: str) -> float:
    """Rudimentary sentiment - positive words / negative words ratio mapped to 0-100."""
    if not text:
        return 50.0
    positive = ["great","good","amazing","love","useful","helpful","win","success","improve"]
    negative = ["problem","worse","issue","bad","fail","losing","loss"]
    txt = text.lower()
    p = sum(txt.count(w) for w in positive)
    n = sum(txt.count(w) for w in negative)
    if p + n == 0:
        return 50.0
    score = 50 + (p - n) * 10
    return max(0.0, min(100.0, score))

def raw_score_components(text: str) -> Dict[str, float]:
    """Compute component scores used for final scoring."""
    return {
        "readability": readability_score(text),
        "structure": structure_score(text),
        "hashtags": hashtag_score(text),
        "sentiment": simple_sentiment_score(text),
        "novelty": novelty_score(text),
    }

def compute_final_score(components: Dict[str, float]) -> float:
    """Weighted aggregation into 0-100 final score."""
    # weights (tweak later)
    w = {
        "structure": 0.30,
        "readability": 0.20,
        "hashtags": 0.10,
        "sentiment": 0.10,
        "novelty": 0.30,
    }
    # normalize
    total = 0.0
    for k, weight in w.items():
        total += components.get(k, 0.0) * weight
    return max(0.0, min(100.0, total))

def generate_text_suggestions(text: str, model_path: str = None, n: int = 3) -> List[str]:
    """Return a few short suggestions for improvement.
    If a local LLM (Mistral) is present, use it. Otherwise use rule-based fixes.
    """
    suggestions = []
    # try LLM if available and model_path provided
    if model_path:
        llm = get_llm(model_path=model_path)
        if llm:
            prompt = f"Provide {n} very short (1-2 line) actionable suggestions to improve this LinkedIn post for engagement:\n\n{text}\n\nSuggestions:"
            try:
                out = llm(prompt, max_tokens=120)
                # extract text safely
                choices = out.get("choices") or []
                if choices:
                    raw = choices[0].get("text") or choices[0].get("message", {}).get("content", "")
                    for line in raw.strip().split("\n"):
                        line = line.strip("-• \t")
                        if line:
                            suggestions.append(line)
                if suggestions:
                    return suggestions[:n]
            except Exception:
                pass

    # fallback rule-based suggestions:
    txt = clean_text(text)
    if len(txt.split()) > 200:
        suggestions.append("Shorten the intro — keep the hook within 1–2 short sentences.")
    else:
        suggestions.append("Make the first sentence a clear hook that promises value or a lesson.")
    if not any(w in txt.lower() for w in ["dm", "comment", "share", "like", "connect"]):
        suggestions.append("Add a clear CTA (e.g., 'Comment your thoughts' or 'DM me to learn more').")
    if len(extract_hashtags(txt)) < 2:
        suggestions.append("Add 3–5 relevant hashtags to increase discoverability.")
    # ensure n suggestions
    while len(suggestions) < n:
        suggestions.append("Consider adding a short real-world example or metric to show impact.")
    return suggestions[:n]

def analyze_post(text: str, model_path_for_rewrites: str = None) -> Dict:
    """Main entry point: analyze a post and return components, final score, and suggestions."""
    txt = clean_text(text)
    comps = raw_score_components(txt)
    final = compute_final_score(comps)
    suggestions = generate_text_suggestions(txt, model_path=model_path_for_rewrites, n=3)
    return {
        "final_score": round(final, 2),
        "components": {k: round(v, 2) for k, v in comps.items()},
        "suggestions": suggestions,
        "hashtags": extract_hashtags(txt),
        "word_count": count_words(txt),
        "char_count": count_chars(txt),
    }
