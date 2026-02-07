import React, { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [responseText, setResponseText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVoiceInput = () => {
    console.log("🎤 Voice input started...");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser 🙏");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // Chrome works best with en-US
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => console.log("✅ Listening...");

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      console.log("🎤 Recognized:", voiceText);
      setQuery(voiceText);

      // Auto trigger Ask after speech ends
      setTimeout(() => {
        console.log("⚡ Auto-triggering Ask call...");
        handleSubmit(null, voiceText); // pass recognized text explicitly
      }, 300);
    };

    recognition.onerror = (event) => console.error("❌ Error:", event.error);
    recognition.onend = () => console.log("ℹ️ Voice input ended.");

    recognition.start();
  };

  const handleSubmit = async (e, overrideQuery) => {
    if (e) e.preventDefault();
    const finalQuery = overrideQuery || query;
    if (!finalQuery.trim()) return;

    setLoading(true);
    setResponseText("");
    setAudioUrl("");
    console.log("📡 Sending query:", finalQuery);

    try {
      const res = await fetch("https://gita-spritual.duckdns.org/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: finalQuery }),
      });

      if (!res.ok) {
        setResponseText("Only devotional questions are allowed 🙏");
        return;
      }

      const data = await res.json();
      setResponseText(data.text);
      setAudioUrl(data.audio_url);
    } catch (err) {
      console.error("❌ Error calling backend:", err);
      setResponseText("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Devotional Q&A</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your question..."
        />
        <button type="submit">Ask</button>
        <button type="button" onClick={handleVoiceInput}>🎤 Speak</button>
      </form>

      {loading && <p>Loading response...</p>}

      {responseText && (
        <div className="response-box">
          <h3>Answer:</h3>
          <p>{responseText}</p>
        </div>
      )}

      {audioUrl && (
        <div className="response-box">
          <h3>Audio:</h3>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
}

export default App;