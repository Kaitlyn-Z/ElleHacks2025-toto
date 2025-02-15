import { spawn } from "child_process";
import path from "path";

export const processSpeech = async () => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", [
      path.resolve("backend/speech_response.py"),
    ]);

    let output = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Python script exited with code ${code}`));
      }
    });
  });
};
