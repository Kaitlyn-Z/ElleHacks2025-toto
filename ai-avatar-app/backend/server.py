from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from speech_response import process_speech

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the folder exists
AUDIO_RESPONSE_FOLDER = "responses"
os.makedirs(AUDIO_RESPONSE_FOLDER, exist_ok=True)

@app.route("/api/process-audio", methods=["POST"])
def process_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file"}), 400

    audio_file = request.files["audio"]
    audio_path = os.path.join(UPLOAD_FOLDER, "input_audio.wav")
    audio_file.save(audio_path)

    # Process speech (transcription + AI response + TTS)
    try:
        result = process_speech(audio_path)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify(result)

@app.route("/audio/<filename>")
def get_audio(filename):
    return send_from_directory(AUDIO_RESPONSE_FOLDER, filename)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
