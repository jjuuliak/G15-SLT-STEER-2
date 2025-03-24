import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
  Avatar,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

const ChatHistory = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const accessToken = useSelector((state) => state.auth?.access_token);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:8000/history", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_index: 0,
          count: 50  
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      const data = await response.json();
      setMessages(data.history || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchHistory();
    }
  }, [accessToken]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        sx={{ 
          height: '100%',
          minHeight: '200px',
          bgcolor: theme.palette.background.default,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Sticky Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          bgcolor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: 2,
          px: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          Chat history
        </Typography>
      </Box>

      {/* Messages Container */}
      <Box
        ref={containerRef}
        sx={{
          flexGrow: 1,
          my: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              color: theme.palette.text.secondary,
            }}
          >
            <Typography>No history found</Typography>
          </Box>
        ) : (
          messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                mb: 2,
                px: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  maxWidth: '100%',
                  width: '100%',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: message.role === 'user' 
                      ? theme.palette.primary.main 
                      : theme.palette.secondary.main,
                    width: 32,
                    height: 32,
                  }}
                >
                  {message.role === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                </Avatar>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: message.role === 'user'
                      ? theme.palette.primary.light
                      : theme.palette.background.paper,
                    borderRadius: 2,
                    maxWidth: '85%',
                    position: 'relative',
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {message.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 1,
                      color: theme.palette.text.secondary,
                      textAlign: 'right',
                    }}
                  >
                    {formatTimestamp(message.time)}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>
    </Box>
  );
};

export default ChatHistory;
