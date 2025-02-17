import {
    LOGIN_SUCCESS,
    LOGOUT
  } from "../actionTypes";

export const loginSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    payload: user,
  });
  
  export const logout = () => ({
    type: LOGOUT,
  });