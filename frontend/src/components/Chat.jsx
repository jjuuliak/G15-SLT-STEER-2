import React, { useState, useRef, useEffect } from "react";
import { 
  TextField, 
  Container, 
  Paper,  
  CircularProgress,
  Stack,
  useTheme,
  InputAdornment,
  IconButton
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import Message from "./Message";

const Chat = () => {
  const theme = useTheme();
  const initialMessage = {
    text: "Hi and welcome to Lifeline Chat! How can I help you today?\n\n" +
        "1. Create a workout plan\n" +
        "2. Create a meal plan\n" +
        "3. Help me understand my symptoms\n" +
        "4. Create an overall lifestyle guide for 4 weeks\n\n" +
        "Do any of these suit your needs? \n\n" +
        "If not, feel free to write a message!",
    options: [
      "Create a workout plan",
      "Create a meal plan",
      "Help me understand my symptoms",
    ],
    sender: "bot"
  };
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([initialMessage]);
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector((state) => state.auth?.access_token);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (msg = message) => {
    if (typeof msg !== 'string' || !msg.trim()) {
      return; // Message can't be empty
    }

    setLoading(true);
    const userMessage = { text: msg, sender: "test_user" }; 
    setMessages((prev) => [...prev, userMessage]);
    //setMessages((prev) => [...prev, { text: message, sender: "test_user" }]); 

    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: msg })
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
    <Container 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "90vh", 
        padding: "20px" 
      }}>
      <Paper 
        style={{ 
          flex: 1, 
          padding: "10px", 
          overflowY: "auto", 
          display: "flex", 
          flexDirection: "column",
          paddingBottom: 20
        }}>
        {messages.map((msg, index) => (
            <Message key={index} msg={msg} sendOption={sendMessage} />
        ))}
        <div ref={messagesEndRef} /> {/* Invisible div to scroll into view */}
      </Paper>
      <Stack 
        direction="row" 
        alignItems="center"
        spacing={1}
        sx={{ 
          backgroundColor: theme.palette.background.paper, 
          padding: "5px", 
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": { boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)" } // Smooth hover effect
        }}
      >
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
          maxRows={5}
          sx={{ 
            wordBreak: "break-word", 
            backgroundColor: theme.palette.primary.secondary,
          }}
          slotProps={{
            input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  onClick={() => sendMessage()}
                  disabled={loading}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    borderRadius: "50%",
                    width: 45,
                    height: 45,
                    marginRight: "5px",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": { transform: "scale(1.1)" }, // Slight zoom on hover
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : <SendIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        }
        />
      </Stack>
    </Container>
  );
};
// 
export default Chat;