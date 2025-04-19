import os
import cv2
import face_recognition

# ─── CONFIG ─────────────────────────────────────────────────────────────
VIDEO_PATH        = "myvideo.mp4"   # path to your .mp4
KNOWN_FACES_DIR   = "know"                  # top‑level folder with subfolders per person
TOLERANCE         = 0.5
FRAME_THICKNESS   = 3
FONT_THICKNESS    = 2
MODEL             = "hog"                   # “hog” is faster, “cnn” is more accurate
# ────────────────────────────────────────────────────────────────────────

# 1) load known faces
known_encodings = []
known_names     = []

for person_name in os.listdir(KNOWN_FACES_DIR):
    person_dir = os.path.join(KNOWN_FACES_DIR, person_name)
    if not os.path.isdir(person_dir):
        continue

    for img_name in os.listdir(person_dir):
        if img_name.startswith('.'):
            continue
        img_path = os.path.join(person_dir, img_name)

        image = face_recognition.load_image_file(img_path)
        encs  = face_recognition.face_encodings(image)
        if not encs:
            print(f"[Warning] no face in {img_path}, skipping")
            continue

        known_encodings.append(encs[0])
        known_names.append(person_name)
print(f"✔️  Loaded {len(known_encodings)} known faces.")

# 2) open video
cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    print("❌ Unable to open video:", VIDEO_PATH)
    exit(1)

# 3) process each frame
while True:
    ret, frame = cap.read()
    if not ret:
        break

    # detect & encode
    locations = face_recognition.face_locations(frame, model=MODEL)
    encodings = face_recognition.face_encodings(frame, locations)

    for (top, right, bottom, left), face_encoding in zip(locations, encodings):
        matches = face_recognition.compare_faces(
            known_encodings, face_encoding, TOLERANCE
        )
        name = "Unknown"
        if True in matches:
            name = known_names[matches.index(True)]

        # draw a box
        cv2.rectangle(frame,
                      (left, top),
                      (right, bottom),
                      (0, 255, 0),
                      FRAME_THICKNESS)

        # draw a label
        cv2.rectangle(frame,
                      (left, bottom),
                      (right, bottom + 22),
                      (0, 255, 0),
                      cv2.FILLED)
        cv2.putText(frame,
                    name,
                    (left + 10, bottom + 15),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,               # fontScale
                    (255, 255, 255),   # color
                    FONT_THICKNESS)

    cv2.imshow("Video Face Recognition", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
