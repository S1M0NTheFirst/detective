import cv2
import face_recognition
from simple_facerec import SimpleFacerec

# img = cv2.imread("Messi1.webp")
# rbg_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
# img_encoding = face_recognition.face_encodings(rbg_img)[0]

# img2 = cv2.imread("images/Messi.webp")
# rbg_img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2RGB)
# img_encoding2 = face_recognition.face_encodings(rbg_img2)[0]

# result = face_recognition.compare_faces([img_encoding], img_encoding2)
# print(result)

# cv2.imshow("Img", img)
# cv2.imshow("Img2", img2)
# cv2.waitKey(0)

sfr = SimpleFacerec()
sfr.load_encoding_images("images/") # Load images of database  

# Load Camera
cap = cv2.VideoCapture(0)



while True:
    ret, frame = cap.read()

    face_locations, face_names = sfr.detect_known_faces(frame) # Detect known faces in frame
    for face_loc, name in zip(face_locations, face_names):
        y1,x1,y2,x2 = face_loc[0],face_loc[1],face_loc[2],face_loc[3]

        cv2.putText(frame, name, (x1, y1 - 100), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 200), 3)
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 200), 4)  

    cv2.imshow("Frame", frame)
 
    key = cv2.waitKey(1)
    if key == 27:
        break 
cap.release()
cv2.destroyAllWindows()