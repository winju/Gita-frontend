import React, { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [responseText, setResponseText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseText("");
    setAudioUrl("");

    try {
      const res = await fetch("http://13.235.13.219:8000:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        const err = await res.json();
        setResponseText("Only devotional questions are allowed 🙏");
        return;

      }

      const data = await res.json();
      setResponseText(data.text);
      setAudioUrl(data.audio_url);
    } catch (err) {
      console.error(err);
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
          style={{ width: "300px", padding: "8px" }}
        />
        <button type="submit" style={{ marginLeft: "10px", padding: "8px" }}>
          Ask
        </button>
      </form>

      {loading && <p>Loading response...</p>}

      {responseText && (
        <div style={{ marginTop: "20px" }}>
          <h3>Answer:</h3>
          <p>{responseText}</p>
        </div>
      )}

      {audioUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Audio:</h3>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
}

export default App;