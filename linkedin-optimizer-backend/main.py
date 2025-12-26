# backend/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import api_router
from dotenv import load_dotenv

load_dotenv()

API_PREFIX = os.getenv("API_PREFIX", "/api/v1")
APP_TITLE = "LinkedIn Optimizer API"

app = FastAPI(title=APP_TITLE)

# CORS - allow Lovable dev + localhost; add any other domains you use
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:7860",
    "https://pro-reach-ai.lovable.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple health/readiness
@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/ready")
async def ready():
    # optionally expand to check model loaded, disk space, etc.
    return {"status": "ready"}

# include your API router
app.include_router(api_router, prefix=API_PREFIX)

# Run with: uvicorn backend.main:app --host 0.0.0.0 --port 7860
