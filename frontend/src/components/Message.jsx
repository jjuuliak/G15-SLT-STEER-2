import React from "react";
import { Paper, Typography, useTheme, Button, Stack } from "@mui/material";


const Message = ({ msg, sendOption }) => {
  const theme = useTheme();

  return (
    <>
      <Paper style={{
        padding: "10px",
        margin: "5px 0",
        backgroundColor: msg.sender === "bot" ? theme.palette.secondary.main : theme.palette.secondary.secondary,
        alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end",
        width: "70%"
      }}>
        <Typography variant="body1" sx={{ color: "white", p: 1, my: 2, whiteSpace: "pre-line" }}>{msg.text}</Typography>
      </Paper>
      {msg.options && (
        <Stack spacing={1} direction="row" mb={2} flexWrap="wrap">
        {msg.options.map((option, index) => (
          <Button 
            key={index} 
            variant="contained" 
            size="small" 
            sx={{ px: '12px', borderRadius: 5 }}
            onClick={() => sendOption(option)}
          >
            {option}
          </Button>
        ))}
        </Stack>
      )}
    </>
  );
}

export default Message;
