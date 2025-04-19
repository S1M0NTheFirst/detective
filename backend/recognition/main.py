import face_recognition
import os
import cv2

faces = "known_faces"

tolerance = 0.5
frame_thickness = 3
font_thickness = 2
model = "cnn"

video = cv2.VideoCapture(1)
 
known_face = []
known_names = []

for name in os.listdir(faces):
    for filename in os.listdir(f"{faces}/{name}"):
        image = face_recognition.load_image_file(f"{faces}/{name}/{filename}")
        encoding = face_recognition.face_encodings(image)[0]
        known_face.append(encoding)
        known_names.append(name)
print("processing unknown faces")

while True:
    ret,img =video.read()
    location = face_recognition.face_locations(img, model=model)
    encoding = face_recognition.face_encodings(img, location)

    for face_location, face_encoding in zip(location, encoding):
        result = face_recognition.compare_faces(known_face, face_encoding, tolerance)
        match = None
        if True in result:
            match = known_names[result.index(True)]
            print(f"Match found: {match}")
            top_left = (face_location[3],face_location[0])
            bottom_right = (face_location[1],face_location[2])
            color = (0,255,0)
            cv2.rectangle(img,top_left,bottom_right,color,frame_thickness)

            top_left = (face_location[3],face_location[2])
            bottom_right = (face_location[1],face_location[2]+22)
            cv2.rectangle(image,top_left,bottom_right,color,cv2.FILLED)
            cv2.putText(img,match,(face_location[3]+10,face_location[2]+15),cv2.FONT_HERSHEY_COMPLEX,(255,255,255),0.5,(200,200,200),font_thickness)

            cv2.imshow(filename,img)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break