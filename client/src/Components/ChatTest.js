import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "../Stylesheets/ChatTestStyles.css";

const ChatTest = () => {
  const socket = useRef(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [userNameInput, setUserNameInput] = useState("");
  const userName = localStorage.getItem("BarTriviaUserName");

  useEffect(() => {
    socket.current = io("http://localhost:8080");

    socket.current.on("connect", () => {
      console.log("Connected to Socket.io server!");
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from Socket.io server");
    });

    socket.current.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() === "") return;
    if (socket.current && messageInput.trim()) {
      socket.current.emit("chat message", messageInput);
    }
    setMessageInput("");
  };

  const handleUserNameSubmit = (e) => {
    e.preventDefault();
    if (userNameInput.trim() === "") return;

    localStorage.setItem("BarTriviaUserName", userNameInput);

    setUserNameInput("");
  };

  return (
    <div>
      {" "}
      <form onSubmit={handleUserNameSubmit}>
        <input
          type="text"
          onChange={(e) => setUserNameInput(e.target.value)}
          className="p-2 m-2 bg-blue-300 border"
          placeholder="enter user name"
          value={userNameInput}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      <ul id="messages">
        {messages.map((msg, index) => {
          return (
            <li key={index}>
              {userName ? userName : "User"}: {msg}
            </li>
          );
        })}
      </ul>
      <form id="form" action="" onSubmit={handleSubmitMessage}>
        <input
          type="text"
          id="input"
          value={messageInput}
          autoComplete="off"
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button>Send</button>
      </form>
    </div>
  );
};

export default ChatTest;
