"""
Runner and lightweight API for the LinkedIn Optimizer local prototype.
"""

import argparse
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# local modules
from app.post_analyzer import analyze_post
from app.image_suggester import suggest_images
from app.profile_analyzer import profile_strength

DEFAULT_MODEL_PATH = os.environ.get(
    "MISTRAL_MODEL_PATH", "models/mistral-7b-instruct-v0.1.Q4_K_M.gguf"
)

# ---- FastAPI app ----
app = FastAPI(title="LinkedIn Optimizer (local prototype)")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Request Models ----
class PostIn(BaseModel):
    text: str
    use_llm: Optional[bool] = False

class ProfileIn(BaseModel):
    headline: str
    about: str
    experience: Optional[List[str]] = []
    skills: Optional[List[str]] = []
    target_roles: Optional[List[str]] = []

# ---- Routes ----
@app.get("/")
def root():
    return {"status": "backend running", "message": "LinkedIn Optimizer API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/analyze_post")
def api_analyze_post(body: PostIn):
    model_path = DEFAULT_MODEL_PATH if body.use_llm else None
    res = analyze_post(body.text, model_path_for_rewrites=model_path)
    return res

@app.post("/suggest_images")
def api_suggest_images(body: PostIn):
    model_path = DEFAULT_MODEL_PATH if body.use_llm else DEFAULT_MODEL_PATH
    return {"suggestions": suggest_images(body.text, model_path=model_path, n=3)}

@app.post("/analyze_profile")
def api_analyze_profile(body: ProfileIn):
    res = profile_strength(
        body.headline, body.about, body.experience or [], body.skills or [], body.target_roles or []
    )
    return res

# ---- CLI runner ----
def cli_loop():
    print("\n--- LINKEDIN OPTIMIZER (LOCAL PROTOTYPE) ---")
    while True:
        print("\nOptions: 1) Analyze Post  2) Image Suggestions  3) Analyze Profile  4) Exit")
        choice = input("Enter choice: ").strip()
        if choice == "4":
            print("Bye.")
            break

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--serve", action="store_true", help="Run FastAPI server")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=7860, type=int)
    args = parser.parse_args()

    if args.serve:
        import uvicorn
        uvicorn.run("main:app", host=args.host, port=args.port, reload=True)  # ← Added reload=True
    else:
        cli_loop()
