const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/process-speech", async (req, res) => {
  try {
    const response = await fetch("http://localhost:5000/api/process-audio", {
      method: "POST",
      body: req.body,
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({ error: "Failed to process speech." });
  }
});

// Serve audio files
app.use("/audio", express.static("responses"));

app.listen(3001, () => {
  console.log("Backend server running on port 3001");
});
