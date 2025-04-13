import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
  ButtonBase
} from '@mui/material';
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from '@mui/icons-material/Menu';
import { logout } from "../redux/actionCreators/authActions"
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import PopupWithTabs from "./popup/PopupWithTabs";
import Profile from "./popup/Profile";

const pages = ['chat', 'meal-plan', 'workout-plan', 'hamster-collection'];

const TopBar = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const [anchorElNav, setAnchorElNav] = React.useState(null);

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
    dispatch({ type: 'RESET_MESSAGES' });
    dispatch(logout());
    navigate('/login');
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigate = (page) => {
    navigate(`/${page}`);
    handleCloseNavMenu();
  };

  return (
    <>
    <AppBar position="static">
      <Toolbar>
        {/*Mobile navigation */}
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={() => handleNavigate(page)}>
                <Typography sx={{ textAlign: 'center' }}>{t(page)}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Title or Logo */}
        <ButtonBase onClick={() => navigate('/')}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Heart Disease MVP
          </Typography>
        </ButtonBase>

        {/* Navigation links on desktop */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'right' }, mr: 2 }}>
          {pages.map((page) => (
            <Button
              key={page}
              onClick={() => handleNavigate(page)}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {t(page)}
            </Button>
          ))}
        </Box>

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
          <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>

    <Profile open={openProfile} handleClose={handleCloseProfile}></Profile>
    <PopupWithTabs open={openSettings} handleClose={handleCloseSettings}></PopupWithTabs>
    
    </>
  );
};

export default TopBar;