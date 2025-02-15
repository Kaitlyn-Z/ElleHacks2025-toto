# Keys
ELEVENLABS_API_KEY = ""
D_ID_API_KEY = ""

import ollama
import requests
import time
import whisper
import pyaudio
import wave
from pydub import AudioSegment
from pydub.playback import play

# System prompt to ensure all responses are easy and consoling
SYSTEM_PROMPT = "Always use simple, easy-to-understand words. Speak in a warm, supportive, and reassuring tone, suitable for dementia patients."

# Audio recording parameters
FORMAT = pyaudio.paInt32
CHANNELS = 1
RATE = 16000  # Sample rate
CHUNK = 1024
AUDIO_FILE = "recorded_audio.wav"

def record_voice():
    """Record audio from the microphone and save it to a file."""
    p = pyaudio.PyAudio()

    print("🎤 Recording...")
    stream = p.open(format=FORMAT, channels=CHANNELS, rate=RATE,
                    input=True, frames_per_buffer=CHUNK)
    frames = []

    try:
        for _ in range(0, int(RATE / CHUNK * 5)):  # 5 seconds recording
            data = stream.read(CHUNK)
            frames.append(data)
    except Exception as e:
        print(f"Error while recording audio: {e}")

    print("🔘 Recording stopped.")

    stream.stop_stream()
    stream.close()
    p.terminate()

    with wave.open(AUDIO_FILE, 'wb') as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(p.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))

    return AUDIO_FILE

def record_and_transcribe():
    """Record voice and transcribe it using Whisper."""
    recorded_file = record_voice()

    # Load the Whisper model and transcribe the audio
    model = whisper.load_model("small")
    result = model.transcribe(recorded_file, language="zh")  
    return result["text"]

def get_ollama_response(user_input):
    """Generate AI response using Ollama with system prompt."""
    try:
        response = ollama.chat(
            model="mistral",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},  # 🔹 System instruction
                {"role": "user", "content": user_input}  # 🗣️ User input
            ]
        )
        ai_reply = response["message"]["content"]
        print("🤖 AI Response:", ai_reply)
        return ai_reply
    except Exception as e:
        print(f"Ollama error: {e}")
        return None

def text_to_speech(text):
    """Convert text to speech using ElevenLabs API."""
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"
    headers = {"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}
    payload = {"text": text, "voice_settings": {"stability": 0.5, "similarity_boost": 0.7}}
    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        with open("response.mp3", "wb") as f:
            f.write(response.content)
        print("🔊 Playing response...")
        play(AudioSegment.from_file("response.mp3"))
        return "response.mp3"
    else:
        print("⚠️ TTS Error:", response.json())
        return None

# 🎯 Main Execution
if __name__ == "__main__":
    user_text = record_and_transcribe()
    print("Transcribed:", user_text)  # Debugging step
    
    if user_text:
        ai_response = get_ollama_response(user_text)
        if ai_response:
            audio_file = text_to_speech(ai_response)
            if audio_file:
                print("Audio response generated and played successfully.")
            else:
                print("Failed to generate audio response.")
        else:
            print("Failed to get a response from Ollama.")
    else:
        print("Failed to transcribe audio.")
