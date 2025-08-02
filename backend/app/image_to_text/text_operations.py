import re
import os

def get_sentence_with_word_regex(text, word):
    """Extract sentences containing the given word from text."""
    # Normalize text - replace newlines and multiple spaces with single space
    text = ' '.join(text.split())
    
    # Simpler pattern that's more reliable
    pattern = f'[^.!?~]+?\\b{re.escape(word)}\\b[^.!?~]*[.!?~]'
    
    # Find all matches with case-insensitive flag
    matches = re.findall(pattern, text, re.IGNORECASE)
    
    # Clean up matches and return
    sentences = []
    for match in matches:
        # Clean up the sentence
        sentence = match.strip()
        # Remove leading/trailing punctuation and whitespace
        sentence = re.sub(r'^[.!?\s]+|[.!?\s]+$', '', sentence)
        
        sentences.append(sentence)
    
    return sentences if sentences else None

