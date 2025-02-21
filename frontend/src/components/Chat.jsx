import React, { useState } from "react";
import { TextField, Button, Container, Paper, Typography, CircularProgress } from "@mui/material";
import Message from "./Message";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([ // Hard coding text examples
    {text: "Who are you and what can you do?", sender: "test_user"}, 
    {text: "I'm a helpful cardiovascular health expert specializing in lifestyle changes. \
        I can answer your questions about improving your heart health through diet, exercise, \
        stress management, and other lifestyle modifications. I can respond in either Finnish or \
        English, depending on the language of your question. Ask me anything!", sender: "bot"}]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) {
      return; // Message can't be empty
    }

    setLoading(true);
    const userMessage = { text: message, sender: "test_user" }; 
    setMessages((prev) => [...prev, userMessage]);
    //setMessages((prev) => [...prev, { text: message, sender: "test_user" }]); 

    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }) //TODO Fetch user_id in login page and store in context api/redux, and in this file use that user_id state
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const data = await res.json();
      const botResponse = { text: data.response, sender: "bot" };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { text: "Error communicating with the backend.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" style={{ display: "flex", flexDirection: "column", height: "80vh", padding: "20px" }}>
      <Typography variant="h5" gutterBottom>ChatBot</Typography>
      <Paper style={{ flex: 1, padding: "10px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {messages.map((msg, index) => (
            <Message key={index} text={msg.text} sender={msg.sender} />
        ))}
        
      </Paper>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // prevent new empty row
              sendMessage();
            }
          }}
        multiline
        maxRows={10}
        style={{ marginTop: "10px", wordBreak: "break-word"}}
      />
      <Button variant="contained" color="primary" onClick={sendMessage} style={{ marginTop: "10px" }} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Send"}
      </Button>
    </Container>
  );
};
// 
export default Chat;