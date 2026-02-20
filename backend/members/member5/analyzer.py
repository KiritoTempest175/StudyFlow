import re
import textstat
from collections import Counter

# --- ABSOLUTE IMPORTS (from backend root) ---
from members.member5.pacing import calculate_duration
from members.member5.extractor import extract_formulas, extract_citations
from members.member5.glossary import build_glossary

# ==========================================
# MAIN EXPORT FUNCTION
# ==========================================
def analyze_text(text: str) -> dict:
    """
    The main function called by routes.py
    """
    if not text:
        return {"error": "No text provided"}

    return {
        "reading_ease_score": textstat.flesch_reading_ease(text) if text.strip() else 0,
        "recommended_duration_seconds": calculate_duration(text),
        "formulas_found": extract_formulas(text),
        "citations_found": extract_citations(text),
        "glossary_candidates": build_glossary(text),
        "word_count": len(text.split())
    }