import face_recognition
import os
import cv2

faces = "know"

tolerance = 0.5
frame_thickness = 3
font_thickness = 2
model = "cnn"

video = cv2.VideoCapture(1)
 
known_face = []
known_names = []

for name in os.listdir(faces):
    person_dir = os.path.join(faces, name)

    # Skip anything that isn't a directory
    if not os.path.isdir(person_dir):
        continue

    for filename in os.listdir(person_dir):
        # (you might also want to skip hidden files here)
        if filename.startswith('.'):
            continue

        image_path = os.path.join(person_dir, filename)
        image      = face_recognition.load_image_file(image_path)
        encodings  = face_recognition.face_encodings(image)
        if not encodings:
            print(f"No face found in {image_path}, skipping")
            continue

        known_face.append(encodings[0])
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
            cv2.putText(img,match,(face_location[3]+10,face_location[2]+15),cv2.FONT_HERSHEY_COMPLEX,0.5,(200,200,200),font_thickness)

            cv2.imshow(filename,img)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break