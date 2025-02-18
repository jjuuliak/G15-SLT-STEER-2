import React, { useState } from 'react';
import { TextField, Button, Box, Typography, InputAdornment, IconButton  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { handleLogin } from '../services/authService';

const LogIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 2,
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
            Login
          </Typography>
          <Typography component="h1" gutterBottom align="start">
            Email
          </Typography>
          <TextField
            placeholder='user@email.com'
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <Typography component="h1" gutterBottom align="start"
          sx={{marginY: 1}}>
            Password
          </Typography>
          <TextField
            placeholder="Enter your password"
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
            Login now
          </Button>

          <Box sx={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
            <Typography 
            sx={{marginRight: 1.5, padding: 1, fontWeight: "bold", textTransform: "none", fontSize: "1.1rem"}}
            variant="button">
                No account?
            </Typography>
          <Button
           onClick={() => navigate('/register')}
          sx={{marginLeft: 1.5, borderRadius: 1.5,fontWeight: "bolder", paddingX: 2.5, textTransform: "none"}}
          variant="outlined">Sign up here</Button> 
          </Box>

          </Box>
        </Box>
    );
}
 
export default LogIn;




