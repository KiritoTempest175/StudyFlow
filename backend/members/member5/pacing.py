import textstat

def calculate_duration(text):
    """
    Decide video length based on how hard the text is.
    Returns time in seconds.
    """

    # If text is empty, give minimum time
    if not text.strip():
        return 60

    score = textstat.flesch_reading_ease(text)

    # Easy text
    if score > 60:
        return 60

    # Medium text
    elif score >= 30:
        return 120

    # Hard text
    else:
        return 180
