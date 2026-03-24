from fastapi import FastAPI
from pydantic import BaseModel
from google import genai
from google.genai.types import HttpOptions # Add this
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("G_API_KEY"),
    http_options=HttpOptions(api_version="v1")
)

class AnalyzeRequest(BaseModel):
    text: str

app = FastAPI()
for model in client.models.list():
        print(model.name)
@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=request.text
        )
        return {"result": response.text}
    except Exception as e:
        return {"error": str(e)}
    