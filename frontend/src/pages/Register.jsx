import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  useTheme
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { registerUser } from '../services/authService';
import { loginSuccess } from '../redux/actionCreators/authActions';
import Logo from '../components/Logo';
import LifelineImage from '../components/LifelineImage';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    name: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError(t('matchPasswords'));
      return;
    }
    setError('');

    try {
      const data = await registerUser(formData);

      dispatch(loginSuccess(data));

      alert(t('registrationSuccessful'));
      navigate('/');
    } catch (error) {
      setError(t('registrationFailed'));
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        item
        xs={0}
        md={6}
        sx={{
          backgroundColor: theme.palette.primary.main,
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "white",
          textAlign: "center",
          flex: 1,
          overflow: 'hidden'
        }}
      >
        <Logo />
        <LifelineImage />

      </Grid>

      {/* Right Side (Registration Form) */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            padding: 3
          }}
        >
          <Typography variant='h4' component='h1' gutterBottom align='center'>
            {t('register')}
          </Typography>

          {error && <Alert severity='error'>{error}</Alert>}

          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2} direction={'column'}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label={t('name')}
                  name='name'
                  variant='outlined'
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label={t('email')}
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
                  label={t('password')}
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
                  label={t('confirmPassword')}
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
                    formData.name === ''
                    || formData.email === ''
                    || formData.password === ''
                    || formData.confirmPassword === ''
                  }
                  fullWidth
                >
                  {t('register')}
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography
              sx={{ mr: 1, fontWeight: "bold", textTransform: "none", fontSize: "1.1rem" }}
              variant="button">
              {t('alreadyAccount')}
            </Typography>
            <Button
              onClick={() => navigate('/login')}
              sx={{ ml: 1 }}
              variant="outlined">
              {t('login')}
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );

};

export default Register;