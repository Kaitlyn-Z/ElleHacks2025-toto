import SpeechRecorder from "./SpeechRecorder";
import "./Main.css"
import totoLogo from "./toto_logo.png";


export const MainPage = () => {
  return (
    <div className="container">
      <div className="logo">
        <img src={totoLogo} alt="Toto Logo" />
      </div>
      <h1 className="main-title">AI Avatar Speech Recognition</h1>
      <SpeechRecorder />
    </div>
  );
};
