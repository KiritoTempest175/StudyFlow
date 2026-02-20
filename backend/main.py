import shutil
import os
import sys
import json
from pypdf import PdfReader
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from members.member3.script_templates import TEACHING_SCRIPT_TEMPLATE

# --- ABSOLUTE IMPORTS (Fixes "Module Not Found") ---
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.gemini_client import call_gemini
from members.member1.interactive_service import get_chat_response, eli5_answer
from members.member2.quiz_format import generate_quiz
from members.member5.extractor import extract_formulas, extract_citations
from members.member5.glossary import build_glossary
from members.member5.pacing import calculate_duration

app = FastAPI()

# --- CORS SETUP ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GLOBAL STORAGE ---
CURRENT_PDF_TEXT = ""

class ChatRequest(BaseModel):
    question: str

@app.get("/")
def health_check():
    return {"status": "AI Study Hub is Running"}

# --- UPLOAD ENDPOINT ---
@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    global CURRENT_PDF_TEXT
    try:
        storage_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "storage")
        os.makedirs(storage_dir, exist_ok=True)
        file_path = os.path.join(storage_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        reader = PdfReader(file_path)
        extracted_text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                extracted_text += page_text + "\n"

        CURRENT_PDF_TEXT = extracted_text.strip()
        print(f"Success! Extracted {len(CURRENT_PDF_TEXT)} chars from {file.filename}")

        if not CURRENT_PDF_TEXT:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from this PDF. It may be a scanned/image-based document."
            )

        # --- Run member5 analysis (no AI needed) ---
        formulas = extract_formulas(CURRENT_PDF_TEXT)
        citations_raw = extract_citations(CURRENT_PDF_TEXT)
        
        # Directly assign the output since it is already in the correct list format
        glossary_list = build_glossary(CURRENT_PDF_TEXT)

        citations_list = [
            {"title": c, "link": f"https://scholar.google.com/scholar?q={c.replace(' ', '+')}"}
            for c in citations_raw
        ]

        # --- Generate AI summary ---
        summary = ""
        try:
            summary_prompt = f"""Summarize the following document in a clear, structured way.
Use bullet points for key topics. Keep it concise (under 200 words).

DOCUMENT TEXT:
{CURRENT_PDF_TEXT[:5000]}"""
            summary = call_gemini(summary_prompt).strip()
        except Exception as e:
            print(f"Summary generation error: {e}")

        if not summary or summary.startswith("AI Error"):
            word_count = len(CURRENT_PDF_TEXT.split())
            summary = (
                f"Document **{file.filename}** uploaded successfully.\n\n"
                f"- **Word count:** {word_count}\n"
                f"- **Formulas found:** {len(formulas)}\n"
                f"- **Citations found:** {len(citations_raw)}\n"
                f"- **Glossary terms:** {len(glossary_list)}\n\n"
                f"You can now use **Chat**, **Quiz**, **Flashcards**, and other study tools."
            )

        return {
            "filename": file.filename,
            "summary": summary,
            "studyData": {
                "quiz": [],
                "flashcards": [],
                "glossary": glossary_list,
                "formulas": formulas,
                "citations": citations_list,
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Upload Error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# --- CHAT ENDPOINT ---
@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if not CURRENT_PDF_TEXT:
        return {"answer": "Please upload a document first."}

    user_q = request.question.lower()

    # Check for ELI5 trigger keywords
    eli5_triggers = ["like i'm 5", "eli5", "explain it simply", "simplify this"]
    is_eli5 = any(trigger in user_q for trigger in eli5_triggers)

    if is_eli5:
        # First get a normal answer, then simplify it
        normal_response = get_chat_response(CURRENT_PDF_TEXT, request.question)
        response = eli5_answer(normal_response)
    else:
        response = get_chat_response(CURRENT_PDF_TEXT, request.question)

    return {"answer": response}


def normalize_quiz_question(q: dict) -> dict:
    """Normalize a quiz question to match frontend's expected format."""
    question_text = q.get("question", "")
    options = q.get("options", [])
    explanation = q.get("explanation", "")

    # Handle correctAnswer (index) vs answer (text)
    if "correctAnswer" in q:
        correct_answer = q["correctAnswer"]
        if isinstance(correct_answer, str):
            try:
                correct_answer = options.index(correct_answer)
            except ValueError:
                correct_answer = 0
    elif "answer" in q:
        answer_text = q["answer"]
        try:
            correct_answer = options.index(answer_text)
        except ValueError:
            correct_answer = 0
    else:
        correct_answer = 0

    return {
        "question": question_text,
        "options": options,
        "correctAnswer": int(correct_answer),
        "explanation": explanation,
    }


# --- QUIZ ENDPOINT (With Crash Protection) ---
@app.post("/generate-quiz")
async def quiz_endpoint():
    if not CURRENT_PDF_TEXT:
        raise HTTPException(status_code=400, detail="No PDF uploaded")

    try:
        quiz_json = generate_quiz(CURRENT_PDF_TEXT)
        # Clean Markdown code fences
        clean_json = quiz_json.replace("```json", "").replace("```", "").strip()
        questions = json.loads(clean_json)

        # Handle both single object and array
        if isinstance(questions, dict):
            questions = [questions]

        if not isinstance(questions, list) or not questions:
            raise ValueError("Empty or invalid quiz data")

        # Normalize every question to expected format
        normalized = [normalize_quiz_question(q) for q in questions]

        return {"questions": normalized}
    except Exception as e:
        print(f"Quiz Generation Error: {e}")
        import traceback
        traceback.print_exc()
        return {"questions": [
            {
                "question": "Quiz generation encountered an issue. What is the main topic of your document?",
                "options": ["Science", "History", "Mathematics", "General Knowledge"],
                "correctAnswer": 3,
                "explanation": "This is a placeholder question. Try generating again."
            }
        ]}

# --- FLASHCARDS ENDPOINT ---
@app.post("/generate-flashcards")
async def flashcards_endpoint():
    if not CURRENT_PDF_TEXT:
        raise HTTPException(status_code=400, detail="No PDF uploaded")

    try:
        prompt = f"""Create 10 flashcards from the following text.
Each flashcard should have a "front" (question or key term) and a "back" (answer or definition).

RULES:
- Output ONLY valid JSON (a JSON array of objects)
- Each object must have EXACT keys: front, back
- front should be a key term or short question
- back should be the answer or definition
- Do NOT add any text, markdown, or code fences outside the JSON array

TEXT:
{CURRENT_PDF_TEXT[:5000]}"""

        response = call_gemini(prompt).strip()
        clean_json = response.replace("```json", "").replace("```", "").strip()
        cards = json.loads(clean_json)

        if isinstance(cards, dict):
            cards = [cards]

        if not isinstance(cards, list) or not cards:
            raise ValueError("Empty flashcard data")

        # Ensure each card has the expected keys
        validated = []
        for card in cards:
            validated.append({
                "front": card.get("front", ""),
                "back": card.get("back", ""),
            })

        return {"cards": validated}
    except Exception as e:
        print(f"Flashcard Generation Error: {e}")
        import traceback
        traceback.print_exc()
        return {"cards": [
            {"front": "Flashcard generation encountered an issue", "back": "Please try again. Make sure your GEMINI_API_KEY is set in the .env file."}
        ]}

# --- VIDEO ENDPOINT ---
# --- VIDEO ENDPOINT ---
@app.post("/generate-video")
async def video_endpoint():
    if not CURRENT_PDF_TEXT:
        return {"videoUrl": "", "script": "Upload a document first to generate a video summary."}

    try:
        # 1. Generate clean script using your template
        prompt = TEACHING_SCRIPT_TEMPLATE.format(text=CURRENT_PDF_TEXT[:5000])
        script = call_gemini(prompt).strip()
        duration = calculate_duration(CURRENT_PDF_TEXT)

        if script.startswith("AI Error"):
            raise ValueError(script)

        # 2. Get Audio and Images from your Microservice
        print("Fetching Audio & Images from Port 5000...")
        audio_url = ""
        audio_duration = 0.0
        images = []
        try:
            assets_res = requests.post(
                "http://127.0.0.1:5000/generate-video-assets", 
                json={"text": script}, timeout=600  # 10 min — TTS + KeyBERT can be slow on long scripts
            )
            if assets_res.status_code == 200:
                assets_data = assets_res.json()
                audio_url = assets_data.get("audioUrl", "")
                audio_duration = assets_data.get("audioDuration", 0.0)
                images = assets_data.get("images", [])
                print(f"Got audio: {audio_url} (duration: {audio_duration:.2f}s)")
        except Exception as e:
            print(f"Service on Port 5000 failed: {e}")

        # 3. Send EVERYTHING (including audio + duration) to the Video Generator
        video_url = ""
        try:
            node_payload = {
                "script": script,
                "title": "Document Summary",
                "readingLevel": 5,
                "images": images,
                "audioUrl": audio_url,
                "audioDuration": audio_duration
            }
            print("Rendering MP4 on Port 3001...")
            node_res = requests.post("http://127.0.0.1:3001/generate-video", json=node_payload, timeout=1800)  # 30 min — Remotion rendering is very slow
            if node_res.status_code == 200:
                node_data = node_res.json()
                if node_data.get("success"):
                    video_url = f"http://127.0.0.1:3001{node_data['videoUrl']}"
        except Exception as e:
            print(f"Video Generator on Port 3001 failed: {e}")

        return {"videoUrl": video_url, "script": script, "duration": duration}
    except Exception as e:
        print(f"Video script error: {e}")
        return {"videoUrl": "", "script": "Video generation failed.", "duration": 60}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)