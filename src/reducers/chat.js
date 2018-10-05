import {
  ADD_MESSAGE,
  SET_CURRENT_USERID,
  ADD_HISTORY,
  ADD_USER,
  REMOVE_USER,
  ADD_TYPING_USER,
  REMOVE_TYPING_USER,
  GET_CHAT_USERS,
  NEW_USER_SELECTED_FOR_CHAT,
} from '../constants/chat';
import { fromJS } from 'immutable';

const INITIAL_STATE = fromJS({
  userID: 0,
  messages: [],
  lastMessageTimestamp: null,
  users: [],
  usersTyping: [],
  chatUsers: [],
  myChatSelectedUserId: null,
  refreshChatPage: 0,
});

function chatReducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
  case SET_CURRENT_USERID:
    return state.update('userID', () => action.payload);
  case ADD_MESSAGE:
    return state.update('messages', (messages) => messages.concat(action.payload));
  case ADD_HISTORY:
    if (action.payload.isReset) {
      const messages = [];
      messages.unshift(...action.payload.messages);
      return state
      .update('messages', () => messages)
      .update('lastMessageTimestamp', () => action.payload.timestamp);
    }
    return state
      .update('messages', (messages) => messages.unshift(...action.payload.messages))
      .update('lastMessageTimestamp', () => action.payload.timestamp);
  case ADD_USER:
    return state
      .update('users', (users) => (users.indexOf(action.payload) >= 0 ? users : users.concat(action.payload)));
  case REMOVE_USER:
    return state
      .update('users', (users) => users.filter((userID) => userID !== action.payload));
  case ADD_TYPING_USER:
    return state
      .update('usersTyping', (users) => (users.indexOf(action.payload) >= 0 ? users : users.concat(action.payload)));
  case REMOVE_TYPING_USER:
    return state
      .update('usersTyping', (users) => users.filter((userID) => userID !== action.payload));

  case GET_CHAT_USERS:
    return state
      .update('chatUsers', () => action.payload);

  case NEW_USER_SELECTED_FOR_CHAT:
    if (action.payload.isRefresh) {
      return state
        .update('myChatSelectedUserId', () => action.payload.userId)
        .update('refreshChatPage', (refreshChatPage)=> refreshChatPage + 1);
    }
    return state
    .update('myChatSelectedUserId', () => action.payload.userId);
  default:
    return state;
  }
}

export default chatReducer;

