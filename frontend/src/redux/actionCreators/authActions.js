import {
    LOGIN_SUCCESS,
    LOGOUT,
    SET_NEW_ACCESS_TOKEN
  } from "../actionTypes";

export const loginSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    payload: user,
  });
  
  export const logout = () => ({
    type: LOGOUT,
  });

export const setNewAccessToken = (token) => ({
  type: SET_NEW_ACCESS_TOKEN,
  payload: token
});