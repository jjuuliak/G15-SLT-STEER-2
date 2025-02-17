import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    console.log('User Registered:', formData);
    alert('Registration Successful!');
    navigate('/')
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
        <Typography variant='h4' component='h1' gutterBottom align='center'>
          Register
        </Typography>

        {error && <Alert severity='error'>{error}</Alert>}

        <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2} direction={'column'}>
            <Grid size={12}>
              <TextField
                fullWidth
                label='Username'
                name='username'
                variant='outlined'
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label='Email'
                name='email'
                type='email'
                variant='outlined'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label='Password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                variant='outlined'
                value={formData.password}
                onChange={handleChange}
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label={
                            showPassword ? 'hide the password' : 'display the password'
                          }
                          onClick={() => setShowPassword(!showPassword)}
                          edge='end'
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label='Confirm Password'
                name='confirmPassword'
                type={showPassword ? 'text' : 'password'}
                variant='outlined'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label={
                            showPassword ? 'hide the password' : 'display the password'
                          }
                          onClick={() => setShowPassword(!showPassword)}
                          edge='end'
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }}
              />
            </Grid>
            <Grid size={12}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                disabled={
                  formData.username === ''
                  || formData.email === ''
                  || formData.password === ''
                  || formData.confirmPassword === ''
                }
                fullWidth
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );

};

export default Register;