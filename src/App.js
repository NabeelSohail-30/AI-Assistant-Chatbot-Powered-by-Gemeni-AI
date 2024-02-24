import { useState } from "react";
function App() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOptions = [
    "What is the capital of India?",
    "What is the capital of France?",
    "What is the capital of Germany?",
    "What is the capital of Australia?",
    "What is the capital of Japan?",
  ];

  const surprise = () => {
    const randomIndex = Math.floor(Math.random() * surpriseOptions.length);
    setValue(surpriseOptions[randomIndex]);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Please enter a question to ask");
      return;
    }

    try {
      const options = {
        method: "POST",
        body: JSON.stringify({ history: chatHistory, message: value }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      console.log("text", data);
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: value,
        },
        {
          role: "model",
          parts: data,
        },
      ]);
    } catch (error) {
      console.error("error", error);
      setError("Something went wrong, please try again later");
    }
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  return (
    <>
      <h1>My App</h1>
      <div className="App">
        <p>
          What do you wanna know ??
          <button
            className="surprise"
            onClick={surprise}
            disabled={!chatHistory}
          >
            Surprise Me !!
          </button>
        </p>
        <div className="input-container">
          <input
            type="text"
            value={value}
            placeholder="Search for anything"
            onChange={(e) => setValue(e.target.value)}
          />
          {!error && <button onClick={getResponse}>ASK ME</button>}
          {error && <button onClick={clear}>Cancel</button>}
          {error && <p className="error">{error}</p>}
        </div>
        <div className="search-result">
          {chatHistory.map((chatItem, _index) => (
            <div key={""}>
              <p className="answer">
                {chatItem.role} : {chatItem.parts}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
