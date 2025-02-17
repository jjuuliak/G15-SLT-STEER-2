import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import AccountCircle from "@mui/icons-material/AccountCircle";
import UserProfile from '../pages/userProfile/UserProfile';

const TopBar = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenProfile = () => {
    handleMenuClose();
    setOpenProfile(true);
  };

  const handleCloseProfile = () => {
    setOpenProfile(false);
  }

  return (
    <>
    <AppBar position="static">
      <Toolbar>
        {/* Title or Logo */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Heart Disease MVP
        </Typography>

        {/* User Profile Button */}
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="user profile"
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={handleMenuOpen}
        >
          <AccountCircle />
        </IconButton>


        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleOpenProfile}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>

    <UserProfile open={openProfile} handleClose={handleCloseProfile} />
    </>
  );
};

export default TopBar;
