# app/image_suggester.py
"""
Ask the local LLM for image suggestions based on post content.
If Llama is not available, fall back to rule-based suggestions.
"""

import re
from typing import List
from utils.text_cleaning import clean_text, extract_hashtags

DEFAULT_MODEL_PATH = "models/mistral-7b-instruct-v0.1.Q4_K_M.gguf"

_llm = None
def _get_llm(model_path: str = DEFAULT_MODEL_PATH):
    global _llm
    if _llm is not None:
        return _llm
    try:
        from llama_cpp import Llama
        _llm = Llama(model_path=model_path, n_ctx=2048, n_threads=4)
        return _llm
    except Exception:
        _llm = None
        return None

def suggest_images(text: str, model_path: str = DEFAULT_MODEL_PATH, n: int = 3) -> List[str]:
    """Return n short image suggestions (type/style) that fit this post."""
    txt = clean_text(text)
    # try LLM
    llm = _get_llm(model_path)
    if llm:
        prompt = (
            "You are an expert visual designer for LinkedIn posts. "
            "Given the post text below, suggest exactly %d short image concepts (each 6-10 words) "
            "that would pair well with the post. No explanation — just numbered list.\n\n"
            "Post:\n\n%s\n\nImage suggestions:"
        ) % (n, txt)
        try:
            out = llm(prompt, max_tokens=180)
            choices = out.get("choices") or []
            if choices:
                raw = choices[0].get("text") or choices[0].get("message", {}).get("content", "")
                lines = [l.strip(" -•\t") for l in raw.split("\n") if l.strip()]
                # keep short cleaned lines
                results = []
                for line in lines:
                    # remove numbering
                    line = re.sub(r"^\d+[\.\)]\s*", "", line).strip()
                    if line:
                        results.append(line)
                if results:
                    return results[:n]
        except Exception:
            pass

    # fallback rules (based on content type)
    tags = extract_hashtags(txt)
    suggestions = []
    txt_lower = txt.lower()
    if "story" in txt_lower or "learned" in txt_lower or "lesson" in txt_lower:
        suggestions.append("Photo: candid photo of person telling a story")
    if any(word in txt_lower for word in ["data","chart","metrics","growth","increase"]):
        suggestions.append("Graphic: clean bar/line chart with key metric highlighted")
    if any(word in txt_lower for word in ["team","we","collaborat","hiring"]):
        suggestions.append("Photo: group/team working or handshake image")
    # fill with general suggestions
    while len(suggestions) < n:
        suggestions.append("Stylized text card with a bold headline and brand color")
    return suggestions[:n]
