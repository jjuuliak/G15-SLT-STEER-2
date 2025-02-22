import React, { useState } from 'react';
import { TextField, Button, Box, Typography, InputAdornment, IconButton, useTheme  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { handleLogin } from '../services/authService';
import { useTranslation } from 'react-i18next';

const LogIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [error, setError] = useState('');
    const theme = useTheme(); // for responsive views
    const navigate = useNavigate();
    const { t } = useTranslation();

    const loginUser = async () => {
      try {
          const result = await handleLogin(username, password);
          if (result.success) {
              navigate('/');
          }
      } catch (err) {
          setError(err.message);
      }
      };

      const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

    return (
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100vh',
        
      }}>
      
      <Box // Left side green picture
      sx={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        display: {xs: 'none', md: 'flex'}, // Responsivity
        backgroundColor: theme.palette.primary.main,
        height: '100vh',
        position: 'relative',
        overflow: 'hidden', // Prevent heartbeat svg from overflowing to login view
      }}>
    
        <Box // solita logo
          sx={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: '50px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="80"
            viewBox="0 0 64 80"
            fill="none"
          >
            <rect y="40" width="20" height="40" fill="white" />
            <rect x="44" width="20" height="40" fill="white" />
            <rect x="22" width="20" height="80" fill="white" />
          </svg>
      </Box>

      


      <Box // Box for Text and heartbeat
      sx={{
        marginRight: 13,
        position: "relative"
      }}>

    <Box // Box for heartbeat svg
      sx={{
        position: "absolute",
        top: '16%',
        left: '70px',
        width: '90%',
        opacity: 0.6,
      
      }}
    >
      <svg
  xmlns="http://www.w3.org/2000/svg"
  width="460"
  height="144"
  viewBox="0 0 460 144"
  fill="none"
>
  <g filter="url(#filter0_d_121_346)">
    <path
      d="M4 79.5H216.5L224 69.5L233 79.5H238.5L240 83L241.5 79.5L263 1L269 135L287.5 69.5L294.5 79.5H462.5"
      stroke="url(#paint0_linear_121_346)"
      strokeWidth="2"
      shapeRendering="crispEdges"
    />
  </g>
  <defs>
    <filter
      id="filter0_d_121_346"
      x="0"
      y="0.73584"
      width="466.5"
      height="142.536"
      filterUnits="userSpaceOnUse"
      colorInterpolationFilters="sRGB"
    >
      <feFlood floodOpacity="0" result="BackgroundImageFix" />
      <feColorMatrix
        in="SourceAlpha"
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        result="hardAlpha"
      />
      <feOffset dy="4" />
      <feGaussianBlur stdDeviation="2" />
      <feComposite in2="hardAlpha" operator="out" />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
      />
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_121_346" />
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_121_346" result="shape" />
    </filter>
    <linearGradient
      id="paint0_linear_121_346"
      x1="4"
      y1="68"
      x2="462.5"
      y2="68"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="white" stopOpacity="0" />
      <stop offset="0.3" stopColor="white" />
      <stop offset="0.7" stopColor="white" />
      <stop offset="1" stopColor="white" stopOpacity="0" />
    </linearGradient>
  </defs>
</svg>

    </Box>
      <Typography
      sx={{
        background: 'linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.44) 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '4.5rem',
        fontWeight: 500,
      }}>
        LIFELINE
      </Typography>
      
      <Typography
      sx={{
        background: 'linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.44) 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '3rem',
        fontWeight: 500,
      }}>
        For your heart.
      </Typography>
      </Box>
      </Box>


      <Box // Box for login view
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'white',
      }}
    >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400, 
            padding: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="start"
          sx={{marginBottom: 3}}>
            {t('login')}
          </Typography>
          <Typography component="h1" gutterBottom align="start">
          {t('email')}
          </Typography>
          <TextField
            placeholder={t('emailPlaceholder')}
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <Typography component="h1" gutterBottom align="start"
          sx={{marginY: 1}}>
            {t('password')}
          </Typography>
          <TextField
            placeholder={t('passwordPlaceholder')}
            variant="outlined"
            type={showPassword ? 'text' : 'password'} // Toggle password type based on the state of visibility
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
          />
          <Button
            onClick={loginUser}
            variant="contained"
            color="secondary"
            sx={{ marginTop: 4, paddingY: 2, borderRadius: 1.5 }}
            fullWidth
          >
            {t('login now')}
          </Button>

          <Box sx={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
            <Typography 
            sx={{marginRight: 1.3, padding: 1, fontWeight: "bold", textTransform: "none", fontSize: "1.1rem"}}
            variant="button">
                {t('no account?')}
            </Typography>
          <Button
           onClick={() => navigate('/register')}
          sx={{marginLeft: 1.3, borderRadius: 1.5,fontWeight: "bolder", paddingX: 2.5, textTransform: "none"}}
          variant="outlined">
            {t('sign up here')}
            </Button> 
          </Box>

          </Box>
         </Box>
        </Box>
    );
}
 
export default LogIn;