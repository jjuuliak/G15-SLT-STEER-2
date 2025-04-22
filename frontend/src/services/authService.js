import { refresh, logout } from "../redux/actionCreators/authActions"

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

export const saveAuthToStorage = (token, user) => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuthFromStorage = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  localStorage.removeItem("link");
};

export const getAuthFromStorage = () => ({
  token: localStorage.getItem("authToken"),
  user: localStorage.getItem("user"),
});

export const fetchWithAuth = async (url, options, accessToken, refreshToken, dispatch, navigate) => {
  if (!accessToken || !refreshToken) throw new Error("Missing token");

  // We can build the headers here so no need to do it in every function calling this
  if (!options.headers) {
    options.headers = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
  } else {
    options.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, options);

  if (response.status === 401) {
    // Try to refresh the token
    const refreshResponse = await fetch("http://localhost:8000/refresh", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      }
    });

    if (refreshResponse.status === 200) {
      const json = await refreshResponse.json();
      // Save new token
      dispatch(refresh(json));

      // Try again with new token
      options.headers["Authorization"] = `Bearer ${json.access_token}`;
      return fetch(url, options);
    } else {
      // From TopBar handleLogout
      dispatch({ type: 'RESET_MESSAGES' });
      dispatch(logout());
      navigate('/login');
    }
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  return response;
};
