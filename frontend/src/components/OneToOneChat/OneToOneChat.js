import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./OneToOneChat.css";

const UserList = ({ users, selectedUser, onSelectUser, loading }) => (
  <div className="user-list">
    <h2>Users</h2>
    {loading ? (
      <div className="loading">Loading users...</div>
    ) : (
      users.map(user => (
        <div
          key={user.id}
          onClick={() => onSelectUser(user)}
          className={`user-item ${selectedUser?.id === user.id ? "selected" : ""}`}
        >
          {user.username}
        </div>
      ))
    )}
  </div>
);

const MessageList = ({ messages, currentUser, selectedUser }) => (
  <div className="chat-messages">
    {messages.map((message, index) => (
      <div
        key={message.id || index}
        className={`message ${message.sender_username === currentUser ? "sent" : "received"}`}
      >
        <strong>
          {message.sender_username === currentUser ? "You" : selectedUser.username}:
        </strong>
        {message.text}
        <small className="timestamp"> --
          {" " + new Date(message.timestamp).toLocaleTimeString()}
        </small>
      </div>
    ))}
  </div>
);

const MessageInput = ({ text, setText, onSend }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="message-input">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
      />
      <button onClick={onSend} disabled={!text.trim()}>
        Send
      </button>
    </div>
  );
};

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const chatService = {
  getUsers: () => axios.get(`${API_BASE_URL}/register/`),
  getMessages: () => axios.get(`${API_BASE_URL}/message/`),
  sendMessage: (message) => axios.post(`${API_BASE_URL}/message/`, message),
};

const OneToOneChat = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const [usersResponse, messagesResponse] = await Promise.all([
          chatService.getUsers(),
          chatService.getMessages()
        ]);

        const uid = usersResponse.data.find(u => u.username === user);
        setUserID(uid);


        const availableUsers = usersResponse.data.filter(
          usr => usr.username !== user
        );
        setUsers(availableUsers);

        const userMessages = messagesResponse.data
          .filter(msg =>
            msg.sender_username === user ||
            msg.receiver_username === user
          )
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setMessages(userMessages);

        if (!selectedUser && userMessages.length > 0) {
          const latestMessage = userMessages[0];
          const defaultUsername = latestMessage.sender_username === user
            ? latestMessage.receiver_username
            : latestMessage.sender_username;

          const defaultUser = availableUsers.find(u => u.username === defaultUsername);
          if (defaultUser) {
            setSelectedUser(defaultUser);
          }
        }
      } catch (error) {
        console.error('Error fetching chat data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

 
  const handleSend = async () => {
    if (!text.trim() || !selectedUser) return;
    console.log('Sending message:', userID, user);
    try {
      const messageData = {
        sender: userID.id,
        receiver: selectedUser.id,
        text: text.trim(),
      };

      const response = await chatService.sendMessage(messageData);
      setMessages(prevMessages => [
        response.data,
        ...prevMessages
      ]);

      setText("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  useEffect(() => {
    if (!user) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await chatService.getMessages();
        const userMessages = response.data
          .filter(msg =>
            msg.sender_username === user ||
            msg.receiver_username === user
          )
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setMessages(userMessages);
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [user]);

  if (!user) {
    return <div className="login-message">Please log in to access the chat.</div>;
  }

  return (
    <div className="chat-app">
      <UserList
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        loading={loading}
      />

      {selectedUser && (
        <div className="chat-window">
          <h2>Chat with {selectedUser.username}</h2>
          <MessageList
            messages={messages.filter(msg =>
              (msg.sender_username === user && msg.receiver_username === selectedUser.username) ||
              (msg.receiver_username === user && msg.sender_username === selectedUser.username)
            )}
            currentUser={user}
            selectedUser={selectedUser}
          />
          <MessageInput
            text={text}
            setText={setText}
            onSend={handleSend}
          />
        </div>
      )}
    </div>
  );
};

export default OneToOneChat;