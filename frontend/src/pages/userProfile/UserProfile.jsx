import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";


const UserProfile = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>User Profile</DialogTitle>
      <DialogContent>
        {/* You can replace this Typography/ContentText with real data or forms */}
        <DialogContentText>
          <Typography variant="body1" gutterBottom>
            This dialog can display user details, account info, or allow
            editing profile data. For example:
          </Typography>
          <ul>
            <li>Name</li>
            <li>Email</li>
            <li>Medical Records/Preferences</li>
            {/* Add forms and logic for updating data here */}
          </ul>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfile;
