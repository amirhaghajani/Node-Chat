import {
  ACTION_SEARCH_REQUEST,
  } from '../constants/app';
import { fromJS } from 'immutable';

const INITIAL_STATE = fromJS({
  userRequestSearch: { amount: null, currency: null, country: null},
});

function appReducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
  case ACTION_SEARCH_REQUEST:
    return state.update('userRequestSearch', () => action.payload);
  default:
    return state;
  }
}

export default appReducer;
