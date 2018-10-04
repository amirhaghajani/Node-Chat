import {
    ACTION_GOTO_CHAT,
  } from '../constants/app';
import { fromJS } from 'immutable';
const INITIAL_STATE = fromJS({
  refreshChatPage: 0,
  myChatSelectedUserId: null,
});
function appReducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
  case ACTION_GOTO_CHAT:
    if (state.myChatSelectedUserId === action.payload.myChatSelectedUserId) return state;
    return state.update('refreshChatPage', (refreshChatPage)=> refreshChatPage + 1)
                .update('myChatSelectedUserId', ()=>action.payload.myChatSelectedUserId);
  default:
    return state;
  }
}

export default appReducer;
