import { setUser } from "../redux/actionCreators/authActions";

export const getProfileData = async (token, dispatch) => {
  fetch("http://localhost:8000/get-profile", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  })
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