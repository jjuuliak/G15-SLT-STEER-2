import { legacy_createStore as createStore, combineReducers } from 'redux';
import authReducer from './authReducer';
import mealPlanReducer from './mealPlanReducer';
import workoutPlanReducer from './workoutPlanReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  mealPlan: mealPlanReducer,
  workoutPlan: workoutPlanReducer,
});

const store = createStore(rootReducer);

export default store;