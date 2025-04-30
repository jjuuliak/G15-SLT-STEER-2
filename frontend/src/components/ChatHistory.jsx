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
  // Theme and translation hooks
  const theme = useTheme();
  const { t } = useTranslation();
  
  const accessToken = useSelector((state) => state.auth?.access_token);
  
  // State management
  const [messages, setMessages] = useState([]); // Array of chat messages
  const [loading, setLoading] = useState(true); // Loading state for initial load
  const [loadingMore, setLoadingMore] = useState(false); // Loading state for pagination
  const [hasMore, setHasMore] = useState(true); // Whether more messages are available
  const [currentStartIndex, setCurrentStartIndex] = useState(0); // Current pagination index
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track if this is the first load
  const [scrollHeight, setScrollHeight] = useState(0); // Track container's scroll height for position maintenance

  // Refs for DOM elements
  const containerRef = useRef(null); // Reference to the scrollable container
  const messagesEndRef = useRef(null); // Reference to the bottom of messages
  const firstMessageRef = useRef(null); // Reference to the first message

/**
 * Filters out messages where the text is valid JSON and also removes the message before it.
 * @param {Array} messages - The array of message objects.
 * @returns {Array} Filtered messages.
 */
const filterOutSystemMessages = (messages) => {
  const result = [];
  for (let i = 0; i < messages.length; i++) {
    const current = messages[i];
    if (current.system) {
      continue; // skip this message
    }
    result.push(current);
  }
  return result;
};



  /**
   * Fetches chat history from the backend with pagination support
   * @param {number} startIndex - Starting index for pagination
   * @param {number} count - Number of messages to fetch
   */
  const fetchHistory = async (startIndex = 0, count = 10) => {
    try {
      // Store current scroll height before loading more messages
      // This is used to maintain scroll position after loading
      if (startIndex > 0 && containerRef.current) {
        setScrollHeight(containerRef.current.scrollHeight);
      }


      const response = await fetch("http://localhost:8000/history", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_index: startIndex,
          count: count
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      const data = await response.json();
      const newMessagesRaw = data.history || [];

      // Filter out messages where text is JSON + previous message
      const newMessages = filterOutSystemMessages(newMessagesRaw);

  
      
      if (startIndex === 0) {
        // Initial load: Set messages directly
        setMessages(newMessages);
        setIsInitialLoad(true);
      } else {
        // Pagination: Prepend older messages to existing ones
        setMessages(prevMessages => [...newMessages, ...prevMessages]);
        setIsInitialLoad(false);
        
        // After loading more messages, adjust scroll position to maintain view
        setTimeout(() => {
          if (containerRef.current) {
            const newScrollHeight = containerRef.current.scrollHeight;
            const scrollDiff = newScrollHeight - scrollHeight;
            containerRef.current.scrollTop = scrollDiff;
            setScrollHeight(newScrollHeight);
          }
        }, 0);
      }
      
      // Update pagination state
      setHasMore(newMessages.length === count);
      setCurrentStartIndex(startIndex + newMessages.length);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load of chat history when component mounts
  useEffect(() => {
    if (accessToken) {
      fetchHistory();
    }
  }, [accessToken]);

  // Scroll to bottom only on initial load
  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current && isInitialLoad) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setIsInitialLoad(false);
    }
  }, [messages.length, isInitialLoad]);

  /**
   * Handles scroll events to detect when to load more messages
   * Triggers when user scrolls near the top of the container
   */
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop } = containerRef.current;
      // Load more messages when near the top (within 100px)
      if (scrollTop < 100 && !loadingMore && hasMore) {
        setLoadingMore(true);
        fetchHistory(currentStartIndex);
      }
    }
  };

  // Add scroll event listener to container
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentStartIndex, loadingMore, hasMore]);

  /**
   * Formats Unix timestamp to local date string
   * @param {number} timestamp - Unix timestamp in seconds
   * @returns {string} Formatted date string
   */
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  // Loading state UI
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
      {/* Chat history title */}
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
            {t("chatHistory")}
        </Typography>
      </Box>

      {/* Messages container */}
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
        {/* Loading indicator for pagination */}
        {loadingMore && (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress size={24} />
          </Box>
        )}
        
        {/* If no messages, show empty state */}
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
            <Typography>{t("noHistoryFound")}</Typography>
          </Box>
        ) : (
          // Message list
          messages.map((message, index) => (
            <Box
              key={index}
              ref={index === 0 ? firstMessageRef : null}
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
                {/* User/AI avatar */}
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
                
                {/* Message bubble */}
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
        {/* Scroll anchor for bottom scroll */}
        <div ref={messagesEndRef} />
      </Box>
    </Box>
  );
};

export default ChatHistory;