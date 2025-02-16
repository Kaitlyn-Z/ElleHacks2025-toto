import os
import whisper
import ollama
import requests

ELEVENLABS_API_KEY = os.getenv("sk_b20071cf5812c6fa8db895d856fa5bb3fb80b47adbfeee4d")  # Get API key from environment
SYSTEM_PROMPT = "Always use simple, easy-to-understand words."
AUDIO_RESPONSE_FOLDER = "responses"

def process_speech(audio_file):
    """Processes audio file: transcribes it, generates AI response, converts response to speech."""
    model = whisper.load_model("small")
    result = model.transcribe(audio_file)
    text = result["text"]

    # Generate AI response with Ollama
    response = ollama.chat(
        model="mistral",
        messages=[{"role": "system", "content": SYSTEM_PROMPT},
                  {"role": "user", "content": text}]
    )
    ai_reply = response["message"]["content"]

    # Convert AI response to speech
    audio_filename = text_to_speech(ai_reply)

    return {"text": text, "ai_response": ai_reply, "audio": audio_filename}

def text_to_speech(text):
    """Converts AI text response to speech using ElevenLabs API."""
    url = "https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID"
    headers = {"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}
    payload = {"text": text, "voice_settings": {"stability": 0.5, "similarity_boost": 0.7}}

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        audio_filename = "response.mp3"
        audio_path = os.path.join(AUDIO_RESPONSE_FOLDER, audio_filename)
        with open(audio_path, "wb") as f:
            f.write(response.content)
        return audio_filename
    return None
