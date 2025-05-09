from gtts import gTTS
import base64
import tempfile
import os

SUPPORTED_LANGUAGES = {
    'af', 'sq', 'ar', 'hy', 'bn', 'bs', 'ca', 'hr', 'cs', 'da', 'nl', 'en', 'eo',
    'et', 'tl', 'fi', 'fr', 'de', 'el', 'gu', 'hi', 'hu', 'is', 'id', 'it', 'ja',
    'jw', 'kn', 'km', 'ko', 'la', 'lv', 'lt', 'mk', 'ml', 'mr', 'my', 'ne', 'no',
    'pl', 'pt', 'pa', 'ro', 'ru', 'sr', 'si', 'sk', 'sl', 'es', 'su', 'sw', 'sv',
    'ta', 'te', 'th', 'tr', 'uk', 'ur', 'vi', 'cy', 'zh-CN', 'zh-TW', 'zu'
}

def build_tts_content(info):
    
    if not info or not isinstance(info, dict):
        return ""

    parts = []

    try:
        for key, value in info.items():
            if isinstance(value, str) and value.strip():
                parts.append(f"{key}: {value}.")
            elif isinstance(value, list):
                items = ', '.join(str(v) for v in value if v)
                if items:
                    parts.append(f"{key}: {items}.")
            elif isinstance(value, dict):
                items = ', '.join(f"{k}: {v}" for k, v in value.items() if k and v)
                if items:
                    parts.append(f"{key}: {items}.")
    except Exception as e:
        print(f"[TTS Build Error] {e}")

    return ' '.join(parts)


def generate_tts(text_or_info, lang='en', is_full_info=False):
    
    try:
        lang = lang.lower().strip()
        if lang not in SUPPORTED_LANGUAGES:
            print(f"[TTS Warning] Unsupported language code: {lang}. Defaulting to 'en'.")
            lang = 'en'

        if is_full_info and isinstance(text_or_info, dict):
            text = build_tts_content(text_or_info)
        else:
            text = str(text_or_info)

        if not text.strip():
            print("[TTS Info] Empty text received. Skipping generation.")
            return ''

        if len(text) > 5000:
            print("[TTS Info] Truncating text to 5000 characters.")
            text = text[:5000]

        tts = gTTS(text=text, lang=lang)

        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as tmp_file:
            tts.save(tmp_file.name)
            temp_path = tmp_file.name

        with open(temp_path, 'rb') as audio_file:
            encoded_audio = base64.b64encode(audio_file.read()).decode('utf-8')

        os.remove(temp_path)
        return encoded_audio

    except Exception as e:
        print(f"[TTS Error] Failed to generate audio for language '{lang}' with text: {text[:100]}...")
        print(f"[TTS Error Details] {e}")
        return ''
