# main.py
"""
Runner and lightweight API for the LinkedIn Optimizer local prototype.

Usage:
- CLI: python main.py
- Server: python main.py --serve  (runs FastAPI + uvicorn)
"""

import argparse
import os
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

# local modules
from app.post_analyzer import analyze_post
from app.image_suggester import suggest_images
from app.profile_analyzer import profile_strength

DEFAULT_MODEL_PATH = os.environ.get(
    "MISTRAL_MODEL_PATH", "models/mistral-7b-instruct-v0.1.Q4_K_M.gguf"
)

# ---- FastAPI models ----
class PostIn(BaseModel):
    text: str
    use_llm: Optional[bool] = False

class ProfileIn(BaseModel):
    headline: str
    about: str
    experience: Optional[List[str]] = []
    skills: Optional[List[str]] = []
    target_roles: Optional[List[str]] = []

# ---- FastAPI app ----
app = FastAPI(title="LinkedIn Optimizer (local prototype)")

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
    print("Model path (for LLM):", DEFAULT_MODEL_PATH)
    while True:
        print("\nOptions: 1) Analyze Post  2) Image Suggestions  3) Analyze Profile  4) Exit")
        choice = input("Enter choice: ").strip()
        if choice == "1":
            text = input("\nPaste your LinkedIn post text (blank to cancel):\n")
            if not text.strip():
                continue
            use = input("Use local LLM for rewrites? (y/N): ").strip().lower() == "y"
            model_path = DEFAULT_MODEL_PATH if use else None
            res = analyze_post(text, model_path_for_rewrites=model_path)
            print("\nResult:", res)
        elif choice == "2":
            text = input("\nPaste your LinkedIn post text:\n")
            if not text.strip():
                continue
            use = input("Use local LLM to suggest images? (y/N): ").strip().lower() == "y"
            res = suggest_images(text, model_path=DEFAULT_MODEL_PATH if use else DEFAULT_MODEL_PATH, n=3)
            print("\nImage suggestions:")
            for r in res:
                print("-", r)
        elif choice == "3":
            headline = input("\nHeadline:\n")
            about = input("\nAbout (paste):\n")
            ex_cnt = int(input("How many experience entries to provide? (0-10): ") or 0)
            exps = []
            for i in range(ex_cnt):
                exps.append(input(f"Experience {i+1}:\n"))
            skills = input("Comma-separated skills:\n").split(",") if input("Add skills? (y/N): ").strip().lower()=="y" else []
            res = profile_strength(headline, about, exps, skills)
            print("\nProfile report:")
            print(res)
        elif choice == "4":
            print("Bye.")
            break
        else:
            print("Invalid choice, try again.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--serve", action="store_true", help="Run FastAPI server")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=7860, type=int)
    args = parser.parse_args()

    if args.serve:
        import uvicorn
        uvicorn.run("main:app", host=args.host, port=args.port, reload=False)
    else:
        cli_loop()
