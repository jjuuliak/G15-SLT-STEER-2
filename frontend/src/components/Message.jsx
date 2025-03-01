import React from "react";
import { Paper, Typography, useTheme, Button, Stack } from "@mui/material";
import PropTypes from 'prop-types';

const Message = ({ msg, sendOption }) => {
  const theme = useTheme();

  return (
    <>
      <Paper 
        style={{
          padding: "10px",
          margin: "5px 0",
          backgroundColor: msg.sender === "bot" ? theme.palette.secondary.main : theme.palette.secondary.secondary,
          alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end",
          width: "70%"
        }}
      >
        <Typography 
          variant="body1" 
          sx={{ color: "white", p: 1, my: 2, whiteSpace: "pre-line" }}
        >
          {msg.text}
        </Typography>
      </Paper>
      {msg.options && (
        <Stack direction="row" mb={2} flexWrap="wrap" gap={1}>
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

Message.propTypes = {
  msg: PropTypes.shape({
    text: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string),
    sender: PropTypes.string.isRequired,
  }).isRequired,
  sendOption: PropTypes.func.isRequired,
};

export default Message;
