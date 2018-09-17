import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import chatReducer from './chat';
import appReducer from './app';

const rootReducer = combineReducers({
  routing: routerReducer,
  chat: chatReducer,
  app: appReducer,
});

export default rootReducer;
