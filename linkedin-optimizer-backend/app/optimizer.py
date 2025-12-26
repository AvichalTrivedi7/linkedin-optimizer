# backend/app/optimizer.py
from typing import Dict, Any
import textstat

def analyze_text_metrics(text: str) -> Dict[str, Any]:
    # lightweight local metrics (deterministic)
    words = len(text.split())
    sentences = max(1, len([s for s in text.split('.') if s.strip()]))
    readability = int(textstat.flesch_reading_ease(text) if text.strip() else 100)
    engagement = min(100, max(0, 50 + (words - 50) // 2))  # simple heuristic
    scores = {"readability": readability, "structure": 70, "engagement": engagement, "keywords": 60}
    metrics = {"wordCount": words, "sentenceCount": sentences, "avgSentenceLength": words / sentences if sentences else 0, "readingTime": f"{max(1, words//200)} min"}
    overall = int(sum(scores.values()) / len(scores))
    return {"overall": overall, "scores": scores, "metrics": metrics}

def build_post_prompt(text: str, metrics: Dict[str, Any]) -> str:
    # prompt for the LLM to generate suggestions
    return f\"\"\"You are an expert LinkedIn copywriter. Given the text and metrics, produce:
1) 3 short hooks
2) 3 improved headlines
3) 5 concise suggestions (title + description)
Return JSON only.

TEXT:
\"\"\" + text + \"\"\"\n\nMETRICS: \"\"\" + str(metrics) + \"\"\"\n\"\"\"

def parse_llm_response(text: str):
    # best-effort parse; if LLM returned JSON, parse it, otherwise fallback to heuristics
    import json
    try:
        return json.loads(text)
    except Exception:
        # naive fallback: return text wrapped
        return [{"type": "raw", "title": "LLM output", "description": text}]

def analyze_profile_metrics(payload: dict):
    # placeholder: implement same style as analyze_text_metrics
    return {"overall": 70, "scores": {"headline": 80, "about": 70, "experience": 65}}

def build_profile_prompt(payload: dict, metrics: dict):
    return f\"Rewrite the headline and about sections to be punchy and professional.\\n\\nHeadline:\\n{payload.get('headline','')}\\n\\nAbout:\\n{payload.get('about','')}\\n\\nMetrics:{metrics}\"

def build_image_suggest_prompt(text: str):
    return f\"Suggest 4 image types and short descriptions that match this post: {text}\"

def parse_image_suggestions(text: str):
    # try to parse JSON, else simple split
    import json
    try:
        return json.loads(text)
    except Exception:
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        return [{"type": "unknown", "title": f"Suggestion {i+1}", "description": l} for i,l in enumerate(lines[:6])]