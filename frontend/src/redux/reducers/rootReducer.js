import { legacy_createStore as createStore, combineReducers } from 'redux';
import authReducer from './authReducer';
import mealPlanReducer from './mealPlanReducer';
import chatReducer from './chatReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  mealPlan: mealPlanReducer,
  chat: chatReducer
});

const store = createStore(rootReducer);

export default store;