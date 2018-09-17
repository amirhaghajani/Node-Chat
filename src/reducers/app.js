import {
    ACTION_TEST,
  } from '../constants/app';
import { fromJS } from 'immutable';
const INITIAL_STATE = fromJS({
});
function appReducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
  case ACTION_TEST:
    return state;
  default:
    return state;
  }
}

export default appReducer;
