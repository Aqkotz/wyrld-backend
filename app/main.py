from fastapi import FastAPI
import os
from dotenv import load_dotenv
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import requests

app = FastAPI()
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
scheduler = AsyncIOScheduler()

@app.on_event("startup")
def startup_event():
    scheduler.add_job(send_request, 'interval', minutes=10)
    scheduler.start()

@app.get("/")
async def root():
    return {"message": "Welcome to Wyrld"}

async def send_request():
    print("Sending request")
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the meaning of life?"},
    ]
    body = {
        "model": "gpt-3.5-turbo",
        "messages": messages,
    }
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }
    response = await requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers=headers,
        json=body
    )
    print(response.json())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)