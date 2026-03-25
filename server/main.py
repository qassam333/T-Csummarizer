from fastapi import FastAPI
from pydantic import BaseModel
from google import genai
from google.genai.types import HttpOptions # Add this
from dotenv import load_dotenv
import os
import json

load_dotenv()

client = genai.Client(
    api_key=os.getenv("G_API_KEY"),
    http_options=HttpOptions(api_version="v1")
)

class AnalyzeRequest(BaseModel):
    text: str

app = FastAPI()
@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    prompt = f"""You are a privacy expert. Analyze the following Terms & Conditions or Privacy Policy and return ONLY valid JSON, no explanation, no markdown.

Return this exact format:
{{
  "rating": <integer 1-10, where 1=very dangerous, 10=very safe>,
  "rating_label": "<Dangerous | Concerning | Moderate | Good | Excellent>",
  "summary": "<2 paragraphs in simple English>",
  "critical_flags": [
    {{
      "severity": "<high | medium | low>",
      "title": "<short title>",
      "detail": "<one sentence explanation>"
    }}
  ]
}}

Text to analyze:
{request.text}
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    clean = (response.text or "").strip().replace("```json", "").replace("```", "").strip()
    return json.loads(clean)