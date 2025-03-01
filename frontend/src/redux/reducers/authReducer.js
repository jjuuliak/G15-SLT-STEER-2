// reducers/authReducer.js
import { LOGIN_SUCCESS, LOGOUT } from "../actionTypes";

const initialState = {
  isAuthenticated: false,
  user: null,
  access_token: null
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user_data,
        access_token: action.payload.access_token
      };

      case LOGOUT:
        return {
          ...state,
          isAuthenticated: false,
          user: null,
          access_token: null
        };

    default:
      return state;
  }
};

export default authReducer;
