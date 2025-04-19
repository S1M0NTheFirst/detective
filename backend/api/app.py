from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

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
