export const recordAudio = async () => {
    try {
      const response = await fetch("/api/record-audio", { method: "POST" });
      if (!response.ok) throw new Error("Failed to record audio");
  
      const data = await response.json();
      return data.text;  // AI response text
    } catch (error) {
      console.error("Error recording audio:", error);
      throw error;
    }
  };
  