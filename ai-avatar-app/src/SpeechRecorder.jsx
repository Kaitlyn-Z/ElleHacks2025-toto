import { useState, useRef } from "react";
import { processAudio } from "./api";

const SpeechRecorder = () => {
  const [transcribedText, setTranscribedText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];
    setRecording(true);

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.start();
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;
    
    mediaRecorderRef.current.stop();
    setRecording(false);
    setLoading(true);

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio", audioBlob);

      console.log("Sending audio to backend...");
      const data = await processAudio(formData);

      setLoading(false);

      if (data.error) {
        console.error("Backend error:", data.error);
        return;
      }

      setTranscribedText(data.text || "No transcription available.");
      setAiResponse(data.ai_response || "No AI response.");
      
      if (data.audio) {
        setAudioSrc(`http://localhost:5001/audio/${data.audio}`);
      }
    };
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording || loading}>
        🎤 Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording || loading}>
        ⏹️ Stop Recording
      </button>

      {loading && <p>⏳ Processing... Please wait.</p>}

      <h3>User Said:</h3>
      <p>{transcribedText}</p>

      <h3>AI Response:</h3>
      <p>{aiResponse}</p>

      {audioSrc && (
        <audio controls>
          <source src={audioSrc} type="audio/mp3" />
        </audio>
      )}
    </div>
  );
};

export default SpeechRecorder;
