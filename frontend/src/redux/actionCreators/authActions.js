import {
  LOGIN_SUCCESS,
  LOGOUT,
  SET_USER
} from "../actionTypes";

export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});
  
export const logout = () => ({
  type: LOGOUT,
});

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
})