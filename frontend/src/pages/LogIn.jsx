import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link, InputAdornment, IconButton  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LogIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
      if (username && password) {
          try {
              const response = await fetch('http://localhost:8000/login', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email: username, password: password }),
              });
  
              if (response.ok) {
                  const data = await response.json();
                  const { access_token, user_data } = data;
                  localStorage.setItem('access_token', access_token);
                  localStorage.setItem('user_data', user_data);
                  navigate('/chat');
              } else {
                  setError('Invalid login credentials');
              }
          } catch (error) {
              setError('An error occurred during login');
          }
      } else {
          setError('Please enter username and password');
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
          backgroundColor: '#f4f6f8',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400, 
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login
          </Typography>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'} // Toggle password type based on the state of visibility
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
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
            onClick={handleLogin}
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Login
          </Button>

          <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Link
            onClick={() => navigate('/')} // TODO: onClick={() => navigate('/forgot-password')} etc
            sx={{ textTransform: 'none', cursor: 'pointer' }}
          >
            Forgot Password?
          </Link>
          <Link
            onClick={() => navigate('/register')}
            sx={{ cursor: 'pointer' }}
          >
            Create an Account
          </Link>
        </Box>

        </Box>
      </Box>
    );
}
 
export default LogIn;