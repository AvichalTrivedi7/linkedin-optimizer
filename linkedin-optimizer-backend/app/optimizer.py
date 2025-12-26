# backend/app/optimizer.py

from typing import Dict, Any, List
import json
import textstat


# -----------------------------
# TEXT / POST METRICS
# -----------------------------
def analyze_text_metrics(text: str) -> Dict[str, Any]:
    words = len(text.split())
    sentences = max(1, text.count("."))
    readability = int(textstat.flesch_reading_ease(text)) if text.strip() else 100

    scores = {
        "readability": readability,
        "structure": 70,
        "engagement": min(100, 50 + words // 4),
        "keywords": 60
    }

    metrics = {
        "wordCount": words,
        "sentenceCount": sentences,
        "avgSentenceLength": round(words / sentences, 2),
        "readingTime": f"{max(1, words // 200)} min"
    }

    overall = int(sum(scores.values()) / len(scores))

    return {
        "overall": overall,
        "scores": scores,
        "metrics": metrics
    }


# -----------------------------
# PROMPT BUILDERS
# -----------------------------
def build_post_prompt(text: str, metrics: Dict[str, Any]) -> str:
    return (
        "You are an expert LinkedIn copywriter.\n\n"
        "TASK:\n"
        "1. Write 3 short hooks\n"
        "2. Write 3 improved headlines\n"
        "3. Write 5 concise suggestions (title + description)\n\n"
        "RULES:\n"
        "- Return ONLY valid JSON\n"
        "- No explanations\n\n"
        f"TEXT:\n{text}\n\n"
        f"METRICS:\n{json.dumps(metrics, indent=2)}"
    )


def build_profile_prompt(payload: dict, metrics: dict) -> str:
    return (
        "You are a LinkedIn profile optimization expert.\n\n"
        "Rewrite the following sections to be professional, concise, and punchy.\n\n"
        f"HEADLINE:\n{payload.get('headline', '')}\n\n"
        f"ABOUT:\n{payload.get('about', '')}\n\n"
        f"EXPERIENCE:\n{payload.get('experience', '')}\n\n"
        f"METRICS:\n{json.dumps(metrics, indent=2)}\n\n"
        "Return ONLY JSON."
    )


def build_image_suggest_prompt(text: str) -> str:
    return (
        "Suggest 4 image ideas suitable for a LinkedIn post.\n"
        "Each suggestion must include:\n"
        "- type\n"
        "- title\n"
        "- short description\n\n"
        "Return ONLY JSON.\n\n"
        f"POST TEXT:\n{text}"
    )


# -----------------------------
# RESPONSE PARSERS
# -----------------------------
