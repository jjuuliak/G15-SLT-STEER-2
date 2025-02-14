import React from "react";
import {Paper, Typography,  } from "@mui/material";


const Message = ({ text, sender }) => {
    return (  
        <Paper style={{
        padding: "10px",
        margin: "5px 0",
        backgroundColor: sender === "bot" ? "#e3f2fd" : "#c8e6c9",
        alignSelf: sender === "bot" ? "flex-start" : "flex-end",
        maxWidth: "70%"
        }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: "0.9rem", color: "textSecondary" }}>
            {sender}
        </Typography>
        <Typography variant="body1">{text}</Typography>
      </Paper> 
        );
}
 
export default Message;
