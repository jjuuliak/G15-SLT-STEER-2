import { SET_MESSAGES, RESET_MESSAGES } from "../actionTypes";

export const setMessages = (messages) => ({
  type: SET_MESSAGES,
  payload: messages
});

export const resetMessages = () => ({
  type: RESET_MESSAGES
});

