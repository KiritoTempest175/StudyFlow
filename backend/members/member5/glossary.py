import json
import sys
import os

# Ensure we can import the core module to use Gemini
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from core.gemini_client import call_gemini

def generate_glossary(text: str) -> list:
    """
    Extracts key terms from the text and uses Gemini to generate actual definitions.
    """
    if not text or len(text.strip()) == 0:
        return []

    # Prompt engineered for strict JSON output
    prompt = f"""
    You are an expert tutor. I will provide you with an educational text. 
    Extract 5 of the most important technical terms or concepts from it.
    Provide a short, accurate, 1-sentence definition for each term based strictly on the text provided.
    
    Return ONLY a valid JSON list of objects. Each object must have exactly two keys: "term" and "definition".
    Do not include markdown formatting like ```json or any other explanatory text.
    
    Text:
    {text[:4000]} 
    """
    
    try:
        # Send to your rate-limit-proof Gemini client
        response = call_gemini(prompt)
        
        # Clean up the response to ensure it is parseable JSON
        clean_json = response.replace("```json", "").replace("```", "").strip()
        glossary_data = json.loads(clean_json)
        
        # Validate the output is a list
        if isinstance(glossary_data, list):
            return glossary_data
        else:
            return []
            
    except Exception as e:
        print(f"Glossary Generation Error: {e}")
        # Safe fallback so the frontend never crashes
        return [
            {
                "term": "AI Overloaded", 
                "definition": "The system could not generate definitions due to high traffic. Please try again."
            }
        ]

# Alias to match what your analyzer.py/main.py expects
def build_glossary(text: str) -> list:
    return generate_glossary(text)