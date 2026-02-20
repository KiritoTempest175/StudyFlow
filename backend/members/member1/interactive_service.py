from textblob import TextBlob
import sys
import os

# Absolute imports from the backend root
from core.gemini_client import call_gemini
from members.member1.interactive import (
    CHAT_SYSTEM_PROMPT,
    FRUSTRATED_INSTRUCTION,
    ELI5_SYSTEM_PROMPT
)

def is_negative_sentiment(text: str) -> bool:
    """Simple polarity check with TextBlob"""
    try:
        analysis = TextBlob(text)
        return analysis.sentiment.polarity < -0.1
    except:
        return False

def build_chat_prompt(pdf_text: str, user_question: str) -> str:
    """Combines system prompt + context + question"""
    system_part = CHAT_SYSTEM_PROMPT

    if is_negative_sentiment(user_question):
        system_part += "\n" + FRUSTRATED_INSTRUCTION

    return f"""{system_part}

=== DOCUMENT CONTENT (use only this) ===
{pdf_text.strip()}

=== STUDENT QUESTION ===
{user_question.strip()}

Your answer:"""

def get_chat_response(pdf_text: str, user_question: str) -> str:
    """Main function for normal / frustrated chat"""
    prompt = build_chat_prompt(pdf_text, user_question)
    try:
        return call_gemini(prompt).strip()
    except Exception as e:
        return f"Error connecting to Gemini: {str(e)}"

def eli5_answer(previous_answer: str) -> str:
    """Rewrite any previous answer in ELI5 style"""
    prompt = f"""{ELI5_SYSTEM_PROMPT}

Original answer to rewrite:
{previous_answer.strip()}

Simplified version for 5-year-old:"""

    try:
        return call_gemini(prompt).strip()
    except Exception as e:
        return f"Error in ELI5 mode: {str(e)}"