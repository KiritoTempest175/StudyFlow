QUIZ_PROMPT = """
You are a strict teacher.

Create 5 multiple-choice questions from the text below.

RULES:
- Output ONLY valid JSON (a JSON array of objects)
- Do NOT add explanations, markdown, or text outside the JSON
- Do NOT wrap in code fences
- Each object must have EXACT keys:
  question, options, correctAnswer, explanation
- options must be a list of 4 strings
- correctAnswer must be the INDEX (0, 1, 2, or 3) of the correct option
- explanation must be a brief explanation of why the answer is correct

TEXT:
"""
