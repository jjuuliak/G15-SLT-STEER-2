import { SET_WORKOUT_PLAN } from "../actionTypes";

export const setWorkoutPlan = (workoutPlan) => ({
  type: SET_WORKOUT_PLAN,
  payload: workoutPlan
});