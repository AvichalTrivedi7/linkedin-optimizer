from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

@app.get("/")
def health():
    return {"status": "backend running"}

@app.post("/analyze/profile")
def analyze_profile(req: TextRequest):
    text = req.text

    # TEMP dummy logic (replace with your real pipeline)
    word_count = len(text.split())
    char_count = len(text)

    return {
        "summary": "Basic profile analysis complete",
        "word_count": word_count,
        "char_count": char_count,
        "suggestions": [
            "Add more impact words",
            "Improve headline clarity",
            "Quantify achievements"
        ]
    }
