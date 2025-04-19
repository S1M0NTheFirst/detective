import threading
import cv2
import sys
from deepface import DeepFace

# Use AVFoundation on macOS
cap = cv2.VideoCapture(0, cv2.CAP_AVFOUNDATION)
if not cap.isOpened():
    print("Error: cannot open camera (tried AVFoundation)", file=sys.stderr)
    sys.exit(1)

cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

counter = 0
reference_img = cv2.imread("my.jpg")
if reference_img is None:
    print("Error: cannot load reference image 'my.jpg'", file=sys.stderr)
    cap.release()
    sys.exit(1)

face_match = False

def check_face(frame):
    global face_match
    try:
        # DeepFace works with RGB; if you run into matching issues you can convert:
        # frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        # reference = cv2.cvtColor(reference_img, cv2.COLOR_BGR2RGB)
        face_match = DeepFace.verify(frame, reference_img.copy())['verified']
    except Exception:
        face_match = False

while True:
    ret, frame = cap.read()
    if not ret:
        print("Warning: frame not grabbed", file=sys.stderr)
        continue

    # every 30 frames, spawn a verify thread
    if counter % 30 == 0:
        threading.Thread(target=check_face, args=(frame.copy(),), daemon=True).start()
    counter += 1

    # overlay result
    text  = "MATCH!" if face_match else "NO MATCH!"
    color = (0,255,0)   if face_match else (0,0,255)
    cv2.putText(frame, text, (20,450), cv2.FONT_HERSHEY_SIMPLEX, 2, color, 3)

    cv2.imshow('video', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
