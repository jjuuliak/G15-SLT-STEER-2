import { legacy_createStore as createStore, combineReducers } from 'redux';
import authReducer from './authReducer';
import mealPlanReducer from './mealPlanReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  mealPlan: mealPlanReducer,
});

const store = createStore(rootReducer);

export default store;