from flask import Flask, request, jsonify
from flask_cors import CORS
from speech_response import process_speech  # Import processing function

app = Flask(__name__)
CORS(app)

@app.route("/api/process-audio", methods=["POST"])
def process_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file"}), 400

    audio_file = request.files["audio"]

    # Call the function in speech_response.py to process audio
    try:
        text = process_speech(audio_file)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"text": text})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
