import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold">Welcome to AI Avatar Chat</h1>
      <p className="mt-4">Upload an image to generate your AI avatar.</p>
      <Link to="/chat">
        <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded">
          Start Chat
        </button>
      </Link>
    </div>
  );
}
