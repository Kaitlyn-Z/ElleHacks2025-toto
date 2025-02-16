from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import whisper
import ollama
import requests
import pyaudio
import wave
from pydub import AudioSegment
from pydub.playback import play

app = Flask(__name__)
CORS(app)  # Allow frontend to call backend

ELEVENLABS_API_KEY = os.getenv("sk_b20071cf5812c6fa8db895d856fa5bb3fb80b47adbfeee4d")  # Get API key from environment
SYSTEM_PROMPT = "Always use simple, easy-to-understand words..."

def record_voice():
    """Records 5 seconds of audio and saves to 'recorded_audio.wav'."""
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    RATE = 16000
    CHUNK = 1024
    AUDIO_FILE = "recorded_audio.wav"

    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT, channels=CHANNELS, rate=RATE,
                    input=True, frames_per_buffer=CHUNK)

    frames = [stream.read(CHUNK) for _ in range(0, int(RATE / CHUNK * 5))]

    stream.stop_stream()
    stream.close()
    p.terminate()

    with wave.open(AUDIO_FILE, 'wb') as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(p.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))

    return AUDIO_FILE

@app.route("/api/record-audio", methods=["POST"])
def record_audio_api():
    audio_file = record_voice()
    
    # Transcribe audio using Whisper
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

    # Convert response to speech (TTS)
    tts_audio = text_to_speech(ai_reply)

    return jsonify({"text": ai_reply, "audio": tts_audio})

def text_to_speech(text):
    """Converts AI text response to speech using ElevenLabs API."""
    url = f"https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID"
    headers = {"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}
    payload = {"text": text, "voice_settings": {"stability": 0.5, "similarity_boost": 0.7}}
    
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        audio_file = "response.mp3"
        with open(audio_file, "wb") as f:
            f.write(response.content)
        return audio_file
    return None

def process_speech(audio_file):
    model = whisper.load_model("base")  # Load Whisper model

    # Convert audio file to text
    audio = whisper.load_audio(audio_file)
    result = model.transcribe(audio)

    return result["text"]

if __name__ == "__main__":
    app.run(port=5001)