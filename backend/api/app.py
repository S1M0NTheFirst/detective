
# run with python -m uvicorn api.app:app --reload in /backend

from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware


import os
from pathlib import Path
from dotenv import load_dotenv, find_dotenv
env_path = find_dotenv(filename=".env.local")
load_dotenv(env_path)

# now you can do:
SUPA_URL = os.getenv("SUPA_URL")
SUPA_KEY = os.getenv("SUPA_KEY")

# this will find backend/source/main.py thanks to __init__.py
from source.main import gen_frames

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["GET"], allow_headers=["*"],
)

@app.get("/video_feed")
def video_feed():
    return StreamingResponse(
        (b"--frame\r\n"
         b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"
         for frame in gen_frames()),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )
