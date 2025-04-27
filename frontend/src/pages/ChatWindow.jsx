import React, { useState } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import Chat from "../components/Chat";
import TopBar from "../components/TopBar";
import ChatHistory from "../components/ChatHistory";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const ChatWindow = () => {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const theme = useTheme();

    const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  return (
    <Box
      id='view-container'
      sx={{ height: "100vh", width: "100vw" }}
    >
      <TopBar />
      <Box sx={{
        display: 'flex',
        height: 'calc(100vh - 64px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Sidebar Toggle Button */}
        <IconButton
          onClick={toggleHistory}
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1200,
            bgcolor: theme.palette.background.paper,
            '&:hover': {
              bgcolor: theme.palette.action.hover,
            },
            boxShadow: 1,
          }}
        >
          {isHistoryOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>

        {/* Chat History Panel */}
        <Box
          sx={{
            width: isHistoryOpen ? '400px' : 0,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflow: 'hidden',
            borderRight: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.default,
          }}
        >
          <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            mt: 4,
          }}>
            <ChatHistory />
          </Box>
        </Box>

        {/* Main Chat Area */}
        <Box sx={{
          flexGrow: 1,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}>
          <Chat />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatWindow;