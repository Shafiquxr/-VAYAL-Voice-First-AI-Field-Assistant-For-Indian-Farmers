import re
import os
import io

class TamilVoiceNormalizer:
    """
    Normalizes agricultural terms, numbers, and Romanized Tamil (Tanglish)
    before sending text to Piper TTS and Ollama.
    """
    PRONUNCIATION_DICT = {
        "VAYAL": "வயல்",
        "Vayal": "வயல்",
        "AI": "செயற்கை நுண்ணறிவு",
        "BPT 5204": "பிபிடி ஐயாயிரத்து இருபத்து நான்கு",
        "BPT5204": "பிபிடி ஐயாயிரத்து இருபத்து நான்கு",
        "NDVI": "என் டி வி ஐ",
        "NDWI": "என் டி டபிள்யூ ஐ",
        "Leaf Blight": "இலை கருகல்",
        "Paddy": "நெல்",
        "Rice": "நெல்",
        "Irrigation": "நீர்ப்பாசனம்",
        "Urea": "யூரியா",
        "NPK": "என் பி கே",
        "pH": "பி எச்",
        "kg": "கிலோ",
        "mm": "மில்லிமீட்டர்",
        "km/h": "கிலோமீட்டர் வேகம்",
        "°C": "டிகிரி செல்சியஸ்",
        "1g": "ஒரு கிராம்",
        "1L": "ஒரு லிட்டர்",
        "48h": "நாற்பத்தெட்டு மணி நேரம்",
        "24h": "இருபத்து நான்கு மணி நேரம்",
        "75%": "எழுபத்தைந்து சதவீதம்",
        "68%": "அறுபத்தெட்டு சதவீதம்",
        "87%": "எண்பத்தேழு சதவீதம்",
    }

    # Romanized Tamil (Tanglish) to Tamil Mapping
    ROMAN_TAMIL_PATTERNS = [
        (r'\bnaalaiku\b|\bnalaiku\b', 'நாளைக்கு'),
        (r'\bmazhai\b|\bmalai\b', 'மழை'),
        (r'\bvaruma\b', 'வருமா'),
        (r'\bthanni\b|\btanni\b|\bthanneer\b', 'தண்ணீர்'),
        (r'\bvidalaama\b|\bvidalama\b', 'விடலாமா'),
        (r'\benna\b', 'என்ன'),
        (r'\bseiyanum\b|\bseyyanum\b', 'செய்ய வேண்டும்'),
        (r'\buram\b', 'உரம்'),
        (r'\bilai\b|\bleaf\b', 'இலை'),
        (r'\byellow\b|\bmanjala\b|\bmanjal\b', 'மஞ்சள்'),
        (r'\baagudhu\b|\baaguthu\b', 'ஆகிறது'),
        (r'\bpoochi\b|\bpest\b', 'பூச்சி'),
        (r'\bvayal\b|\bvayalla\b', 'வயலில்'),
        (r'\bvilai\b|\bprice\b', 'விலை'),
    ]

    @classmethod
    def transliterate_roman_tamil(cls, text: str) -> str:
        """Converts common colloquial Tanglish input into natural Tamil script."""
        normalized = text.lower()
        for pattern, replacement in cls.ROMAN_TAMIL_PATTERNS:
            normalized = re.sub(pattern, replacement, normalized, flags=re.IGNORECASE)
        return normalized

    @classmethod
    def normalize_for_tts(cls, tamil_text: str) -> str:
        """Replaces abbreviations and agricultural terms with pure phonetic Tamil script."""
        result = tamil_text
        for term, phonetic in cls.PRONUNCIATION_DICT.items():
            result = result.replace(term, phonetic)
        # Strip markdown syntax for natural speech
        result = re.sub(r'[*_#`~]', '', result)
        result = re.sub(r'https?://\S+', '', result)
        return result.strip()
