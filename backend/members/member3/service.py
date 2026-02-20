from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from keybert import KeyBERT
from gtts import gTTS
from mutagen.mp3 import MP3
import os
import uuid
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use absolute path to ensure the media folder is created in the right place
MEDIA_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'media')
os.makedirs(MEDIA_FOLDER, exist_ok=True)
app.mount("/media", StaticFiles(directory=MEDIA_FOLDER), name="media")

print("Loading KeyBERT model... (This may take a moment)")
kw_model = KeyBERT()

class VideoRequest(BaseModel):
    text: str

@app.post("/generate-video-assets")
def generate_assets(request: VideoRequest):
    full_script = request.text
    if not full_script:
        raise HTTPException(status_code=400, detail="No text provided")
    
    print("Generating Full Audio via gTTS...")
    audio_filename = f"{uuid.uuid4()}.mp3"
    filepath = os.path.join(MEDIA_FOLDER, audio_filename)
    
    # Generate ONE full audio file for the Remotion player
    tts = gTTS(text=full_script, lang='en', slow=False)
    tts.save(filepath)
    audio_url = f"http://127.0.0.1:5000/media/{audio_filename}"

    # Measure the actual MP3 duration so the video engine can match it
    audio_duration = 0.0
    try:
        audio_info = MP3(filepath)
        audio_duration = audio_info.info.length  # duration in seconds
        print(f"Audio duration: {audio_duration:.2f}s")
    except Exception as e:
        print(f"Could not read MP3 duration: {e}")
        # Fallback: estimate from word count (~150 WPM for gTTS)
        word_count = len(full_script.split())
        audio_duration = (word_count / 150) * 60
        print(f"Estimated audio duration: {audio_duration:.2f}s")

    print("Extracting Smart Image Keywords via KeyBERT...")
    try:
        keywords_data = kw_model.extract_keywords(
            full_script, 
            keyphrase_ngram_range=(1, 1), 
            stop_words='english', 
            top_n=5
        )
        keywords = [kw[0] for kw in keywords_data]
    except Exception as e:
        print(f"KeyBERT Error: {e}")
        keywords = ["education", "learning", "study", "concept", "science"]

    # Generate image array mapped to your keywords
    images = []
    for i, kw in enumerate(keywords):
        images.append({
            "keyword": kw,
            "url": f"https://picsum.photos/1920/1080?random={i+10}"
        })

    return {
        "audioUrl": audio_url,
        "audioDuration": audio_duration,
        "images": images
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5000, timeout_keep_alive=600)