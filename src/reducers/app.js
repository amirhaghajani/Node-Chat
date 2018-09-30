import {
    ACTION_GOTO_CHAT,
  } from '../constants/app';
import { fromJS } from 'immutable';
const INITIAL_STATE = fromJS({
  refreshChatPage: 0,
  reservedUserId: null,
});
function appReducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
  case ACTION_GOTO_CHAT:
    return state.update('refreshChatPage', (refreshChatPage)=> refreshChatPage + 1)
                .update('reservedUserId', ()=>action.payload.reservedUserId);
  default:
    return state;
  }
}

export default appReducer;
