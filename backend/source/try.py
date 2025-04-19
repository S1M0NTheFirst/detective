import cv2
from simple_facerec import SimpleFacerec

# 1) Initialize and load your known faces
sfr = SimpleFacerec()
sfr.load_encoding_images("images/")   # point this at your folder of face images

# 2) Open your video file instead of the webcam
video_path = "videos/myvideo.mp4" 
cap = cv2.VideoCapture(video_path)

if not cap.isOpened():
    print(f"Error: cannot open video {video_path}")
    exit()

# 3) Process frame by frame
while True:
    ret, frame = cap.read()
    if not ret:
        # end of video
        break

    # detect & annotate
    face_locations, face_names = sfr.detect_known_faces(frame)
    for (y1, x2, y2, x1), name in zip(face_locations, face_names):
        cv2.putText(frame, name,
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_DUPLEX,
                    1, (0, 0, 200), 2)
        cv2.rectangle(frame,
                      (x1, y1),
                      (x2, y2),
                      (0, 0, 200), 4)

    # show
    cv2.imshow("Video Face Recognition", frame)
    if cv2.waitKey(1) & 0xFF == 27:  # ESC key to exit early
        break

# 4) Clean up
cap.release()
cv2.destroyAllWindows()
