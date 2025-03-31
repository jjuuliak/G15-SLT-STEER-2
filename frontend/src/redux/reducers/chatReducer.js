import { SET_MESSAGES, RESET_MESSAGES } from "../actionTypes";

const initialState = {
  messages: [{
    text: "Hi and welcome to Lifeline Chat! How can I help you today?\n\n" +
        "1. Create a workout plan\n" +
        "2. Create a meal plan\n" +
        "3. Help me understand my symptoms\n" +
        "4. Create an overall lifestyle guide for 4 weeks\n\n" +
        "Do any of these suit your needs? \n\n" +
        "If not, feel free to write a message!",
    options: [
      "Create a workout plan",
      "Create a meal plan",
      "Help me understand my symptoms",
    ],
    sender: "bot"
  }], // Initialize messages state
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MESSAGES:
      return {
        ...state,
        messages: action.payload, // Update messages with the payload
      };
    case RESET_MESSAGES: 
      return initialState;
    default:
      return state;
  }
};

export default chatReducer;
