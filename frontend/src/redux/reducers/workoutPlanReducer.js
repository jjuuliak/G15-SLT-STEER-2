import { SET_WORKOUT_PLAN } from "../actionTypes";

const initialState = {
  workoutPlan: null
};

const workoutPlanReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WORKOUT_PLAN:
      return { ...state, workoutPlan: action.payload };
    default:
      return state;
  }
};

export default workoutPlanReducer;