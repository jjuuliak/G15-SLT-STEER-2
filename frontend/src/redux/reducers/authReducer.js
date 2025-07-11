// reducers/authReducer.js
import { LOGIN_SUCCESS, LOGOUT, SET_USER, REFRESH } from "../actionTypes";

const storedToken = localStorage.getItem("authToken");
const storedRefresh = localStorage.getItem("refreshToken");
const storedUser = localStorage.getItem("user");
const user = storedUser !== "undefined" ? JSON.parse(storedUser) : null;

const initialState = {
  isAuthenticated: !!storedToken,
  user: user,
  access_token: storedToken || null,
  refresh_token: storedRefresh || null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        access_token: action.payload.access_token,
        refresh_token: action.payload.refresh_token
      };

      case LOGOUT:
        if (state.refresh_token) {
          fetch("http://localhost:8000/logout", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${state.refresh_token}`,
              "Content-Type": "application/json",
            }
          });
        }

        return {
          ...state,
          isAuthenticated: false,
          user: null,
          access_token: null,
          refresh_token: null
        };
      
      case SET_USER:
        return {
          ...state,
          user: action.payload,
        }

    case REFRESH:
      return {
        ...state,
        access_token: action.payload.access_token
      };

    default:
      return state;
  }
};

export default authReducer;
