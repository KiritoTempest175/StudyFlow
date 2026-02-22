import os
import time
import random
from google import genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

primary_key = os.getenv("GEMINI_API_KEY")
alt_key = os.getenv("ALT_KEY")
AVAILABLE_KEYS = [key for key in [primary_key, alt_key] if key]

if not AVAILABLE_KEYS:
    print("Warning: No Gemini API keys found in .env file")

# We only include the models your dashboard shows have active free quotas
AVAILABLE_MODELS = [
    'gemini-2.5-flash-lite', # 10 RPM limit
    'gemini-2.5-flash',      # 5 RPM limit
    'gemini-2.0-flash',
    'gemini-3.0-flash'
]

def call_gemini(prompt: str) -> str:
    if not AVAILABLE_KEYS:
        return "AI Error: No API keys configured."

    max_retries = 3
    base_delay = 2

    # LOAD BALANCING: Shuffle the models so concurrent requests don't all hit the same model first
    models_to_try = AVAILABLE_MODELS.copy()
    random.shuffle(models_to_try)

    for attempt in range(max_retries):
        for key_index, current_key in enumerate(AVAILABLE_KEYS):
            # NEW SDK SYNTAX: Initialize the Client
            client = genai.Client(api_key=current_key)
            key_name = "Primary Key" if key_index == 0 else f"Alternate Key {key_index}"

            for model_name in models_to_try:
                try:
                    # NEW SDK SYNTAX: Call generate_content via client.models
                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt
                    )
                    return response.text
                    
                except Exception as e:
                    error_msg = str(e).lower()
                    
                    if "429" in error_msg or "exhausted" in error_msg or "quota" in error_msg:
                        print(f"[Attempt {attempt + 1} | {key_name}] {model_name} rate-limited (429). Skipping...")
                        continue 
                    elif "404" in error_msg or "not found" in error_msg:
                        print(f"[Attempt {attempt + 1} | {key_name}] {model_name} is offline (404). Skipping...")
                        continue
                    elif "400" in error_msg and "api_key" in error_msg:
                        print(f"[{key_name}] API Key is invalid. Breaking to next key...")
                        break 
                    else:
                        print(f"[{key_name}] Unknown error on {model_name}: {e}. Skipping...")
                        continue 
            
            print(f"[{key_name}] All models failed. Switching to next API key if available...")

        wait_time = base_delay * (2 ** attempt)
        print(f"All keys and models failed. Sleeping for {wait_time} seconds before retrying...")
        time.sleep(wait_time)

    return "AI Error: The system is overloaded or unavailable. Please try again later."
