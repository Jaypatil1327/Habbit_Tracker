import speech_recognition as sr
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):

    try:
        audio_data = await file.read()
        recognizer = sr.Recognizer()
        with open("temp.mp3", "wb") as f:
            f.write(audio_data)

        with sr.AudioFile("temp.mp3") as source:
            audio = recognizer.record(source)
        text = recognizer.recognize_google(audio)
        return {
            "status":"success",
            "data":text
        }
    except:
        return {
            "status":"failure",
            "data":"Internal server error!"
        }

@app.get("/test")
def cors_test():
    return {"status":"success"}
