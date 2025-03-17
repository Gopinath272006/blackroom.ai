import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)
else:
    raise ValueError("GEMINI_API_KEY not found")

app = FastAPI()

# Define request model
class ChatRequest(BaseModel):
    prompt: str

# Chat endpoint
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Define request model
class ChatRequest(BaseModel):
    prompt: str

# Chat endpoint
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI()

# Set up Google Gemini API
GEMINI_API_KEY="AIzaSyAKRU5sTHghZO8lf5UECX_wOSKAgVscs-M"
genai.configure(api_key="AIzaSyAKRU5sTHghZO8lf5UECX_wOSKAgVscs-M")

# Define request model
class ChatRequest(BaseModel):
    prompt: str

@app.post("/chat")
async def chat(request: ChatRequest):
    prompt = request.prompt
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")

    try:
        model = genai.GenerativeModel("models/gemini-2.0-flash-lite")
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"message": "FastAPI with Google Gemini is running"}

