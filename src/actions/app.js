import { browserHistory  } from 'react-router';
import axios from 'axios';
import { ACTION_HIDE_LOADING, ACTION_SHOW_LOADING, ACTION_SHOW_ERROR,
  ACTION_GOTO_CHAT,
} from '../constants/app';

export function addUserToChat(userId) {
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
  return {
    type: ACTION_GOTO_CHAT,
    payload: { myChatSelectedUserId: myChatSelectedUserId },
  };
}

