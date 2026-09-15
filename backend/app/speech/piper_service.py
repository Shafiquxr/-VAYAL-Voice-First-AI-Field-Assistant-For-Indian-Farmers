import os
import subprocess
import tempfile
import base64
from app.speech.tamil_normalizer import TamilVoiceNormalizer

class PiperTTSService:
    """
    Local Piper TTS Service for Tamil Speech Synthesis (ta_IN-rasa_female-medium).
    Generates local WAV audio for browser playback with 0 cloud dependencies.
    """

    def __init__(self):
        self.model_name = os.getenv("PIPER_MODEL", "ta_IN-rasa_female-medium")
        self.model_path = os.getenv("PIPER_MODEL_PATH", f"./models/{self.model_name}.onnx")

    def synthesize_speech_wav(self, text: str) -> str:
        """
        Synthesizes Tamil text to speech and returns a base64 Data URI or WAV file path.
        """
        normalized_text = TamilVoiceNormalizer.normalize_for_tts(text)

        # Check if local piper executable and model ONNX exist
        if os.path.exists(self.model_path):
            try:
                temp_wav = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
                temp_wav_path = temp_wav.name
                temp_wav.close()

                cmd = [
                    "piper",
                    "--model", self.model_path,
                    "--output_file", temp_wav_path
                ]

                process = subprocess.Popen(
                    cmd,
                    stdin=subprocess.PIPE,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
                process.communicate(input=normalized_text)

                if os.path.exists(temp_wav_path) and os.path.getsize(temp_wav_path) > 0:
                    with open(temp_wav_path, "rb") as f:
                        b64_audio = base64.b64encode(f.read()).decode("utf-8")
                    try:
                        os.remove(temp_wav_path)
                    except:
                        pass
                    return f"data:audio/wav;base64,{b64_audio}"
            except Exception as e:
                print(f"Piper execution fallback: {e}")

        # Return empty if model not locally installed; frontend Web Speech Synthesis will execute seamlessly
        return ""

piper_service = PiperTTSService()
