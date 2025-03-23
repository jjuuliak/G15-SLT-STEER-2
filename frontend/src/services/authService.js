import { setNewAccessToken, logout } from '../redux/actionCreators/authActions';

export const handleLogin = async (email, password) => {
  if (!email || !password) {
    throw new Error('Please enter email and password');
  }

  try {
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    const data = await response.json();
    if (!response.ok) {
      if(response.status === 401) {
        throw new Error('Invalid login credentials');
      } else {
        throw new Error('An error occurred during login');
      }
    }
    return data;
  } catch (error) {
    throw new Error(error.message || 'An error occurred during login');
  }
};

export const registerUser  = async (formData) => {
  try {
    const response = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    throw new Error('Registration failed. Please try again.');
  }
};

export const refreshToken = async (refreshToken, navigate, dispatch) => {

  const res = await fetch("http://localhost:8000/refresh", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${refreshToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.log('Refresh token expired.')
    dispatch(logout());
    navigate('/login')
    return;
  }

  const refreshData = await res.json();
  dispatch(setNewAccessToken(refreshData.access_token));
}