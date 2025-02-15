import { useState } from "react";
import { recordAudio } from "./recordAudio.js"; 

export const MainPage = () => {
  const [response, setResponse] = useState("");

  const handleRecord = async () => {
    try {
      const text = await recordAudio();
      setResponse(text);
    } catch (error) {
      console.error("Recording failed:", error);
    }
  };

  return (
    <div className="container">
      <h1>AI Avatar App</h1>
      <button onClick={handleRecord}>🎤 Record Audio</button>
      {response && <p>AI Response: {response}</p>}
    </div>
  );
};
