#source .venv/bin/activate
# python -m uvicorn api.app:app --reload --host 0.0.0.0 --port 8000
from fastapi import FastAPI, BackgroundTasks
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware


from source.main import gen_frames  # yields raw jpg bytes

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def mjpeg_generator(background_tasks: BackgroundTasks):
    """
    Wrap each raw JPEG from gen_frames() in the multipart headers
    so <img> can render it as an MJPEG stream.
    """
    for frame in gen_frames():
        # enqueue_alerts here if you still need them…
        yield b"--frame\r\n"
        yield b"Content-Type: image/jpeg\r\n\r\n"
        yield frame
        yield b"\r\n"

@app.get("/video_feed")
def video_feed(background_tasks: BackgroundTasks):
    """
    Streams a proper multipart/x-mixed-replace MJPEG response.
    """
    return StreamingResponse(
        mjpeg_generator(background_tasks),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )
