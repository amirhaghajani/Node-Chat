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
import axios from 'axios';

export function newUserSelectedForChat(userId, isRefresh) {
  return {
    type: NEW_USER_SELECTED_FOR_CHAT,
    payload: {userId: userId, isRefresh: isRefresh},
  };
}

export function getChatUsers() {
  return (dispatch) => {
    axios.post('/post',
      {
        type: 'getChatUsers',
      }, {
        headers: {
          'X-CSRF-Token': window._csrf,
        },
      })
    .then( function th(response) {
      if (response.data.hasError) {
        console.log('Error in getChatUsers ' + response.data.erroreMessage);
        return {};
      }
      dispatch(getChatUsersSucc(response.data));
      return {};
    })
    .catch(function ca(error) {
      console.log('Error in getChatUsers ' + error);
    });
  };
}

function getChatUsersSucc(users) {
  return {
    type: GET_CHAT_USERS,
    payload: users,
  };
}

export function setCurrentUserID(userID) {
  return {
    type: SET_CURRENT_USERID,
    payload: userID,
  };
}

export function addMessage(message) {
  return {
    type: ADD_MESSAGE,
    payload: message,
  };
}

export function addHistory(messages, timestamp, isReset) {
  return {
    type: ADD_HISTORY,
    payload: {
      messages,
      timestamp,
      isReset,
    },
  };
}

export function addUser(userID) {
  return {
    type: ADD_USER,
    payload: userID,
  };
}

export function removeUser(userID) {
  return {
    type: REMOVE_USER,
    payload: userID,
  };
}

export function addTypingUser(userID) {
  return {
    type: ADD_TYPING_USER,
    payload: userID,
  };
}

export function removeTypingUser(userID) {
  return {
    type: REMOVE_TYPING_USER,
    payload: userID,
  };
}
