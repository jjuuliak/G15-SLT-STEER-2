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
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from 'react-router';
import Message from "./Message";
import { setMealPlan } from "../redux/actionCreators/mealPlanActions"
import { setWorkoutPlan } from "../redux/actionCreators/workoutPlanActions";

const Chat = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const hasSent = useRef(false); // To make sure that the message from dashboard is not sent twice
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
  const messagesFromRedux = useSelector((state) => state.chat.messages);
  const [messages, setMessages] = useState([initialMessage]);
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector((state) => state.auth?.access_token);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initial = location.state?.initialMessage;

    if (initial && !hasSent.current) {
      hasSent.current = true; // Prevent re-trigger
      setMessages((prev) => [...prev, initial]);
      sendMessage(initial);

      navigate(location.pathname, { replace: true }); // Clean the message from the state
    }
  }, [location.state]);

  useEffect(() => {
    setMessages(messagesFromRedux);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesFromRedux]);

  const sendMessage = async (msg = message) => {
    if (typeof msg !== 'string' || !msg.trim()) {
      return; // Message can't be empty
    }

    setLoading(true);
    const userMessage = { text: msg, sender: "test_user" }; 
    setMessages((prev) => [...prev, userMessage]);
    dispatch({ type: 'SET_MESSAGES', payload: [...messages, userMessage] });
    setMessage("");

    try {
      const url = msg.includes('meal plan') 
        ? 'http://localhost:8000/ask-meal-plan' 
        : msg.includes('workout plan') 
        ? 'http://localhost:8000/ask-workout-plan' 
        : 'http://localhost:8000/ask';
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: msg.includes('meal plan') ? JSON.stringify({ message: 'Create me a meal plan for a week', "language": "English" }) : JSON.stringify({ message: msg, "language": "English" })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      if (msg.includes('meal plan')) {
        const data = await response.json();
        dispatch(setMealPlan(JSON.parse(data.response)));
        const botMessage = { text: JSON.parse(data.response).explanation, sender: "bot" };
        setMessages((prev) => [...prev, botMessage]);
        dispatch({ type: 'SET_MESSAGES', payload: [...messages, userMessage, botMessage] });
      }
      else if (msg.includes('workout plan')) {
        const data = await response.json();
        dispatch(setWorkoutPlan(JSON.parse(data.response)));
        const botMessage = { text: JSON.parse(data.response).explanation, sender: "bot" };
        setMessages((prev) => [...prev, botMessage]);
        dispatch({ type: 'SET_MESSAGES', payload: [...messages, userMessage, botMessage] });
      }
      else {
        // Add an empty bot message that we'll update as we receive chunks
        const botMessage = { text: "", sender: "bot" };
        setMessages((prev) => [...prev, botMessage]);
        
        // Set up streaming response handling
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = ""; // Stores the complete response text
        let pendingWords = []; // Buffer for words waiting to be displayed
        let lastRenderTime = 0;
        const RENDER_INTERVAL = 10;

        // Function to render pending words
        const renderWords = (timestamp) => {
          // Check if enough time has passed since last render
          if (timestamp - lastRenderTime >= RENDER_INTERVAL && pendingWords.length > 0) {
            // Take up to 3 words from pending buffer
            const wordsToAdd = pendingWords.splice(0, 3).join('');
            accumulatedText += wordsToAdd;
            
            // Update the message
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                text: accumulatedText,
                sender: "bot"
              };
              return newMessages;
            });
            
            lastRenderTime = timestamp;
          }
          
          // Continue animation if there are more words to render
          if (pendingWords.length > 0) {
            requestAnimationFrame(renderWords);
          }
        };

        // Read chunks of data as they arrive
        while (true) {
          const { done, value } = await reader.read();
          if (done) break; // Exit if stream is finished

          // Decode the binary chunk into text and parse the JSONs
          const chunk = decoder.decode(value);
          
          // Split concatenated JSON objects and parse them 
          // since one chunk can contain multiple JSON objects
          const jsonStrings = chunk
            .split('}{')
            .map((str, i, arr) => {
              if (i === 0) return str + (arr.length > 1 ? '}' : '');
              if (i === arr.length - 1) return '{' + str;
              return '{' + str + '}';
            });

          // Process each JSON object
          for (const jsonString of jsonStrings) {
            try {
              const jsonChunk = JSON.parse(jsonString);

              // Handle text responses for streaming
              if (jsonChunk.response) {
                const newText = jsonChunk.response;
                // Split by whitespace but keep the separators
                const words = newText.split(/(\s+)/);
                
                // Add words to pending buffer
                pendingWords.push(...words);
                
                // Start rendering if not already started
                if (pendingWords.length === words.length) {
                  requestAnimationFrame(renderWords);
                }
              }
              
              // Handle attributes that come
              if (jsonChunk.attributes) {
                console.log('Received message attributes:', jsonChunk.attributes);
              }
            } catch (e) {
              console.warn("Failed to parse JSON string:", e);
              console.warn("Problematic JSON string:", jsonString);
            }
          }
        }
        // Dispatch the final bot message to Redux
        dispatch({ type: 'SET_MESSAGES', payload: [...messages, userMessage, { text: accumulatedText, sender: "bot" }] });
      }
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