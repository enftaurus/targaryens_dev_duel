import React, { useState, useRef } from "react";
import axios from "axios";
import "../style.css";

const FAQ = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! This is the FAQ section. Ask me anything about using the app.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    const chat = chatContainerRef.current;
    if (chat) chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" });
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/chat/", {
        message: trimmed,
      });

      const botReply =
        res.data.reply || "This FAQ helps you understand and navigate the app.";

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Unable to fetch an answer right now. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-wrapper">
      {/* Header */}
      <header className="chat-header">FAQ</header>

      {/* Chat body */}
      <div className="chat-body" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble ${
              msg.sender === "user" ? "user-bubble" : "bot-bubble"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <textarea
          className="chat-input"
          placeholder="Type your question here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="2"
        />
        <button className="send-button" onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default FAQ;
