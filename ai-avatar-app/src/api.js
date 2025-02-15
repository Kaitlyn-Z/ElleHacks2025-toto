export async function processAudio(data) {
    const response = await fetch("/api/process-audio", {
      method: "POST",
      body: data,
    });
    return response.json();
  }
  