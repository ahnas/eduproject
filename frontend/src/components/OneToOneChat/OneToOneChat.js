import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./OneToOneChat.css";

const socket = io("wss://echo.websocket.org"); // Public WebSocket server for testing

const OneToOneChat = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Listen for messages
    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageData = { sender: username, text: newMessage };

      // Send message to WebSocket server
      socket.emit("message", messageData);

      // Add message to state
      setMessages((prev) => [...prev, messageData]);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-section">
        <h2>Live Chat</h2>
        <div className="chat-box">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${
                  message.sender === username ? "chat-right" : "chat-left"
                }`}
              >
                <strong>{message.sender}: </strong>
                <span>{message.text}</span>
              </div>
            ))
          ) : (
            <p className="chat-placeholder">Start chatting now!</p>
          )}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default OneToOneChat;
