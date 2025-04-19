# backend/source/main.py

import cv2
from simple_facerec import SimpleFacerec

# initialize once
sfr = SimpleFacerec()
sfr.load_encoding_images("images")  # path to your images folder

cap = cv2.VideoCapture(0)

def gen_frames():
    """
    Yields raw JPEG bytes with face boxes & names drawn.
    """
    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        # run your existing face-recog logic
        face_locations, face_names = sfr.detect_known_faces(frame)
        for (y1, x1, y2, x2), name in zip(face_locations, face_names):
            cv2.putText(frame, name, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 200), 3)
            cv2.rectangle(frame, (x1, y1), (x2, y2),
                          (0, 0, 200), 4)

        # encode to JPEG
        success, buffer = cv2.imencode(".jpg", frame)
        if not success:
            continue

        yield buffer.tobytes()
