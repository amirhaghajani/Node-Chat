import { browserHistory  } from 'react-router';
import axios from 'axios';
import { ACTION_HIDE_LOADING, ACTION_SHOW_LOADING, ACTION_SHOW_ERROR, ACTION_SEARCH_REQUEST,
} from '../constants/app';
import { newUserSelectedForChat } from './chat';

export function searchRequests(amount, currency, country) {
  return {
    type: ACTION_SEARCH_REQUEST,
    pageload: { amount: amount, currency: currency, country: country },
  };
}

export function addUserToChat(userId) {
  console.log('addUserToChat:' + userId);
  // if (!userId) {
    // return (dispatch)=>{
      // dispatch(gotoChat(null));
    // };
  // }
  return (dispatch) => {
    dispatch(showLoding());
    axios.post('/post',
      {
        type: 'addUserToChatWiths',
        userId: userId,
      }, {
        headers: {
          'X-CSRF-Token': window._csrf,
        },
      })
    .then( function th(response) {
      if (response.data.hasError) {
        dispatch(showError('Error in addUserToChatWiths ' + response.data.erroreMessage));
        return;
      }
      dispatch(hideLoding());
      dispatch(gotoChat(userId));
    })
    .catch(function ca(error) {
      dispatch(hideLoding());
      dispatch(showError('Error in addUserToChatWiths ' + error));
      console.log(error);
    });
  };
}

export function showLoding() {
  return {
    type: ACTION_SHOW_LOADING,
  };
}
export function hideLoding() {
  return {
    type: ACTION_HIDE_LOADING,
  };
}
export function showError(msg) {
  return {
    type: ACTION_SHOW_ERROR,
    pageload: { message: msg },
  };
}

export function gotoChat(myChatSelectedUserId) {
  browserHistory.push('/MyChat');
  return (dispatch) => {
    dispatch(newUserSelectedForChat(myChatSelectedUserId, true));
  };
}

