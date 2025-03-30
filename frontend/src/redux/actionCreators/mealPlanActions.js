import { SET_MEAL_PLAN } from "../actionTypes";

export const setMealPlan = (mealPlan) => ({
  type: SET_MEAL_PLAN,
  payload: mealPlan
});