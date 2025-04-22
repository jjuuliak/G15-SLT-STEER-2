
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, InputAdornment, IconButton, useTheme  } from '@mui/material';
import { useNavigate } from 'react-router';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { handleLogin } from '../services/authService';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Logo';
import LifelineImage from '../components/LifelineImage';
//redux imports
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/actionCreators/authActions';

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [error, setError] = useState('');
    const theme = useTheme(); // for responsive views
    const navigate = useNavigate();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const loginUser = async () => {
      try {
          setError('');
          const result = await handleLogin(email, password);
          dispatch(loginSuccess(result));
          navigate('/');
          
      } catch (err) {
        if (err.message === 'Invalid login credentials') {
          setError(t('invalidCredentials'));
      } else {
          setError(t('loginErrorOccurred'));
      }
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
    
        <Logo />
        <LifelineImage />
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                loginUser();
              }
            }}
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
          {error && <Typography color="error" sx={{ marginTop: 1 }}>{error}</Typography>}
          <Button
            onClick={loginUser}
            variant="contained"
            sx={{ marginTop: 4, paddingY: 2, borderRadius: 1.5 }}
            fullWidth
          >
            {t('loginNow')}
          </Button>

          <Box sx={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
            <Typography 
            sx={{marginRight: 1.3, padding: 1, fontWeight: "bold", textTransform: "none", fontSize: "1.1rem"}}
            variant="button">
                {t('noAccount')}
            </Typography>
          <Button
           onClick={() => navigate('/register')}
          sx={{marginLeft: 1.3, borderRadius: 1.5,fontWeight: "bolder", paddingX: 2.5, textTransform: "none"}}
          variant="outlined">
            {t('signUpHere')}
            </Button> 
          </Box>

          </Box>
         </Box>
        </Box>
    );
}

export default LogIn;