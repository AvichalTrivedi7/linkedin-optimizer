# app/profile_analyzer.py
"""
Profile optimization checks:
- headline, about, experience bullets, skills, featured suggestions
- returns component scores and actionable items
"""

from typing import Dict, List
from utils.text_cleaning import clean_text, sentence_tokenize
import re

def analyze_headline(headline: str) -> Dict:
    h = clean_text(headline)
    score = 0
    suggestions = []
    if not h:
        return {"score": 0, "suggestions": ["Add a clear headline that states role + value."]}
    # length & clarity
    words = h.split()
    if 4 <= len(words) <= 12:
        score += 40
    else:
        suggestions.append("Keep headline concise (4–12 words) describing role and value.")
    # presence of keywords (role/skill)
    role_words = ["engineer","developer","data","ai","manager","designer","student","intern"]
    if any(r in h.lower() for r in role_words):
        score += 30
    else:
        suggestions.append("Include your role or main skill (e.g., 'Data Scientist' or 'AI Researcher').")
    # CTA / availability
    if any(x in h.lower() for x in ["open to", "seeking", "internship", "freelance"]):
        score += 10
    else:
        suggestions.append("If you're open to work, add 'Open to internships' or similar.")
    # keyword density: add small score for power words
    if re.search(r"\b(lead|founder|senior|principal|expert|specialist)\b", h, re.I):
        score += 20
    return {"score": min(100, score), "suggestions": suggestions}

def analyze_about(about: str) -> Dict:
    a = clean_text(about)
    if not a:
        return {"score": 0, "suggestions": ["Write a short about section: Hook → achievements → CTA."]}
    sents = sentence_tokenize(a)
    score = 0
    suggestions = []
    if len(sents) >= 3:
        score += 40
    else:
        suggestions.append("Structure About with 3 parts: hook, top achievements, call-to-action.")
    # presence of metrics
    if re.search(r"\b\d+%|\b\d+ (?:years|yrs|months|mos)|\b\d+K\b|\b\d+\b", a):
        score += 30
    else:
        suggestions.append("Add measurable outcomes (e.g., 'increased X by 40%').")
    # tone check (first person)
    if re.search(r"\bI\b", a):
        score += 20
    else:
        suggestions.append("Write in first person to make it personable (use 'I').")
    return {"score": min(100, score), "suggestions": suggestions}

def analyze_experience(experience_list: List[str]) -> Dict:
    """
    experience_list: list of strings (each experience block or bullet)
    """
    if not experience_list:
        return {"score": 0, "suggestions": ["Add at least one role with 3-4 achievement bullets."]}
    total_bullets = sum(len([b for b in re.split(r"[•\n-]", s) if b.strip()]) for s in experience_list)
    score = 0
    suggestions = []
    if total_bullets >= 3:
        score += 40
    else:
        suggestions.append("Use 3–5 bullets per role with measurable achievements.")
    # look for metric mentions
    joined = " ".join(experience_list)
    if re.search(r"\b(increased|reduced|improved|delivered|launched)\b", joined, re.I):
        score += 30
    else:
        suggestions.append("Use action verbs (e.g., 'increased', 'launched').")
    return {"score": min(100, score), "suggestions": suggestions}

def analyze_skills(skills: List[str], target_roles: List[str] = None) -> Dict:
    """Compare listed skills to a target role skillset (optional)."""
    suggestions = []
    if not skills:
        return {"score": 0, "suggestions": ["Add core skills relevant to your target role (e.g., Python, SQL)."]}
    score = min(100, len(skills) * 10)
    # if target roles provided, ensure overlap
    if target_roles:
        lower_skills = set(s.lower() for s in skills)
        needed = set()
        # naive mapping - could be improved later
        role_map = {
            "data scientist": ["python","pandas","ml","scikit","sql","nlp"],
            "product manager": ["roadmap","stakeholder","analytics","sql"],
            "frontend": ["react","javascript","css","html"]
        }
        for role in target_roles:
            for r, req in role_map.items():
                if r in role.lower():
                    needed.update(req)
        if needed:
            missing = [k for k in needed if k not in lower_skills]
            if missing:
                suggestions.append(f"Consider adding skills: {missing[:5]}")
                score = max(40, score - 10)
    return {"score": score, "suggestions": suggestions}

def profile_strength(headline: str, about: str, experience: List[str], skills: List[str], target_roles: List[str] = None) -> Dict:
    """Combine checks into one profile strength report."""
    h = analyze_headline(headline)
    a = analyze_about(about)
    e = analyze_experience(experience)
    s = analyze_skills(skills, target_roles)
    # simple aggregation
    final = (h["score"] * 0.25 + a["score"] * 0.35 + e["score"] * 0.25 + s["score"] * 0.15)
    suggestions = []
    suggestions += h.get("suggestions", [])
    suggestions += a.get("suggestions", [])
    suggestions += e.get("suggestions", [])
    suggestions += s.get("suggestions", [])
    # condense suggestions
    condensed = []
    for sug in suggestions:
        if sug not in condensed:
            condensed.append(sug)
    return {
        "profile_score": round(final, 2),
        "components": {
            "headline": h,
            "about": a,
            "experience": e,
            "skills": s
        },
        "suggestions": condensed[:8]
    }
