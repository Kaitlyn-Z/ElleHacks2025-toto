import { useState, useEffect } from "react";
import { processAudio } from "./api.js";

export default function SpeechRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [microphone, setMicrophone] = useState("Detecting...");
  const [transcription, setTranscription] = useState("");
  let mediaRecorder;
  let audioChunks = [];

  // Detect and display the active microphone
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const mic = devices.find((device) => device.kind === "audioinput");
      setMicrophone(mic ? mic.label || "Microphone detected" : "No microphone found");
    });
  }, []);

  // Start recording audio
  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const response = await processAudio(formData);
      setTranscription(response.text);
    };

    mediaRecorder.start();
  };

  // Stop recording and send to backend
  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorder.stop();
  };

  return (
    <div className="speech-recorder">
      <h2>Microphone: {microphone}</h2>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      <div className="transcription">
        <h3>Transcription:</h3>
        <p>{transcription || "No speech detected yet..."}</p>
      </div>
    </div>
  );
}
