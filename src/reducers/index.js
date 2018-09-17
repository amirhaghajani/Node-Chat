import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import chatReducer from './chat';

const rootReducer = combineReducers({
  routing: routerReducer,
  chat: chatReducer,
});

export default rootReducer;
