import { useState } from "react";
import { processAudio } from "./api.js"; // Ensure the path is correct
import { recordAudio } from "./recordAudio.js"; // Import audio recording

export const MainPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  
  const handleRecord = async () => {
    setIsRecording(true);
    const audioBlob = await recordAudio(); // Record the audio
    setIsRecording(false);

    const audioFile = new File([audioBlob], "recorded_audio.wav", { type: "audio/wav" });
    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const response = await ProcessAudio(formData); // Send to backend
      console.log("AI Response:", response);
    } catch (error) {
      console.error("Error processing audio:", error);
    }
  };

  return (
    <div>
      <button onClick={handleRecord} disabled={isRecording}>
        {isRecording ? "Recording..." : "Record Audio"}
      </button>
    </div>
  );
};
