# backend/app/api.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.model_server import server
from app import optimizer

api_router = APIRouter()

class PostRequest(BaseModel):
    text: str

class ProfileRequest(BaseModel):
    headline: str = ""
    about: str = ""
    experience: str = ""

@api_router.on_event("startup")
async def startup_event():
    # load the model once at startup (may take time)
    loaded = server.load()
    if not loaded:
        raise RuntimeError("Model failed to load")

@api_router.post("/analyze-post")
async def analyze_post(req: PostRequest):
    # run local analyzer logic (fast local metrics)
    metrics = optimizer.analyze_text_metrics(req.text)
    # run LLM for creative suggestions (wrapped)
    prompt = optimizer.build_post_prompt(req.text, metrics)
    llm_resp = await server.generate(prompt, max_tokens=256, temperature=0.2)
    suggestions = optimizer.parse_llm_response(llm_resp["text"])
    return {
        "overallScore": metrics["overall"],
        "scores": metrics["scores"],
        "metrics": metrics["metrics"],
        "suggestions": suggestions,
        "llm_raw": llm_resp["raw"]
    }

@api_router.post("/analyze-profile")
async def analyze_profile(req: ProfileRequest):
    payload = {"headline": req.headline, "about": req.about, "experience": req.experience}
    metrics = optimizer.analyze_profile_metrics(payload)
    prompt = optimizer.build_profile_prompt(payload, metrics)
    llm_resp = await server.generate(prompt, max_tokens=300, temperature=0.2)
    suggestions = optimizer.parse_llm_response(llm_resp["text"])
    return {"overallScore": metrics["overall"], "scores": metrics["scores"], "suggestions": suggestions}

@api_router.post("/suggest-images")
async def suggest_images(req: PostRequest):
    prompt = optimizer.build_image_suggest_prompt(req.text)
    llm_resp = await server.generate(prompt, max_tokens=200, temperature=0.6)
    suggestions = optimizer.parse_image_suggestions(llm_resp["text"])
    return {"suggestions": suggestions}
