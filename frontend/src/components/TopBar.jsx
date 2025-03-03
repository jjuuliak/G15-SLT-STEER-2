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
import { logout } from "../redux/actionCreators/authActions"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import PopupWithTabs from "./popup/PopupWithTabs";
import Profile from "./popup/Profile";

const TopBar = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {t} = useTranslation();

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


  const handleOpenSettings = () => {
    handleMenuClose();
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
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
          <MenuItem onClick={handleOpenProfile}>{t('profile')}</MenuItem>
          <MenuItem onClick={handleOpenSettings}>{t('settings')}</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>

    <Profile open={openProfile} handleClose={handleCloseProfile}></Profile>
    <PopupWithTabs open={openSettings} handleClose={handleCloseSettings}></PopupWithTabs>
    
    </>
  );
};

export default TopBar;