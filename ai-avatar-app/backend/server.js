const express = require('express');
const { exec } = require('child_process');
const app = express();

app.use(express.json());

app.post('/api/process-speech', (req, res) => {
    exec('python3 backend/speech_response.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`Exec error: ${error}`);
            return res.status(500).json({ error: "Failed to process speech." });
        }
        res.json({ response: stdout.trim() });
    });
});

app.listen(3001, () => {
    console.log('Backend server running on port 3001');
});
