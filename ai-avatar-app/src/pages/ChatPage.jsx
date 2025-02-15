import { useState } from "react";

export default function ChatPage() {
  const [response, setResponse] = useState("");

  const handleProcessSpeech = async () => {
    const res = await fetch('/api/process-speech', { method: "POST" });
    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div>
      <h1>AI Avatar Chat</h1>
      <button onClick={handleProcessSpeech}>Speak</button>
      <p>Response: {response}</p>
    </div>
  );
}
