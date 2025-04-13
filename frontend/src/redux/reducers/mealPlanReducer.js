import { SET_MEAL_PLAN } from "../actionTypes";

const initialState = {
  mealPlanResponse: null
};

const mealPlanReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MEAL_PLAN:
      return { 
        ...state, 
        mealPlanResponse: action.payload
      };
    default:
      return state;
  }
};

export default mealPlanReducer;