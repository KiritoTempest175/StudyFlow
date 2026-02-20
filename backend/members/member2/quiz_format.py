from pydantic import BaseModel
from typing import List
import sys
import os

# Absolute imports from the backend root
from core.gemini_client import call_gemini
from members.member2.tutor_persona import QUIZ_PROMPT

class Quiz(BaseModel):
    question: str
    options: List[str]
    answer: str

def generate_quiz(pdf_text: str):
    """
    Combines the strict QUIZ_PROMPT with PDF text to get a JSON quiz
    """
    full_prompt = f"{QUIZ_PROMPT}\n\n{pdf_text[:5000]}"
    try:
        # Calls the function defined in core/gemini_client.py
        response = call_gemini(full_prompt).strip()
        return response 
    except Exception as e:
        return {"error": f"Quiz Generation failed: {str(e)}"}