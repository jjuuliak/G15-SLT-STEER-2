// reducers/authReducer.js
import { LOGIN_SUCCESS, LOGOUT, SET_USER } from "../actionTypes";

const initialState = {
  isAuthenticated: false,
  user: null,
  access_token: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        access_token: action.payload.access_token
      };

      case LOGOUT:
        return {
          ...state,
          isAuthenticated: false,
          user: null,
          access_token: null
        };
      
      case SET_USER:
        return {
          ...state,
          user: action.payload,
        }

    default:
      return state;
  }
};

export default authReducer;
