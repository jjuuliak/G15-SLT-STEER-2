import { setUser } from "../redux/actionCreators/authActions";
import { fetchWithAuth } from '../services/authService';

export const getProfileData = async (accessToken, refreshToken, dispatch, navigate) => {
    fetchWithAuth("http://localhost:8000/get-profile", {
      method: "POST",
      headers: null, // Default set in fetchWithAuth
    }, accessToken, refreshToken, dispatch, navigate)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      return response.json();
    })
    .then((data) => {
      if (data.user_data) {
        dispatch(setUser(data.user_data));
        return data;
      }
    })
    .catch((error) => {
      console.error("Error fetching profile data:", error);
    });
};