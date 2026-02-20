import re

def extract_formulas(text):
    """
    Find simple math formulas inside text.
    """
    pattern = r"[a-zA-Z]\s*=\s*[^,\n]+"
    return list(set(re.findall(pattern, text)))


def extract_citations(text):
    """
    Find citations like [1] or (Smith, 2020).
    """
    pattern = r"\[[0-9]+\]|\([A-Za-z]+,\s*\d{4}\)"
    return list(set(re.findall(pattern, text)))
