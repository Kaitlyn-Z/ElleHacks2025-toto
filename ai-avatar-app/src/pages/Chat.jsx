import { useState } from "react";
import processSpeech from "@wasp/actions/processSpeech";

export default function Chat() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");

  const handleSpeechInput = async () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US"; 
    recognition.onresult = async (event) => {
      const userText = event.results[0][0].transcript;
      setText(userText);

      const aiResponse = await processSpeech({ text: userText });
      setResponse(aiResponse);
    };
    recognition.start();
  };

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold">AI Avatar Chat</h2>
      <button onClick={handleSpeechInput} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
        Speak
      </button>
      <p className="mt-4"><strong>You:</strong> {text}</p>
      <p className="mt-2"><strong>AI:</strong> {response}</p>
    </div>
  );
}
