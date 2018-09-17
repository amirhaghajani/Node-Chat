import { browserHistory  } from 'react-router';
import {
    ACTION_TEST,
  } from '../constants/app';

export function actionTest() {
  return {
    type: ACTION_TEST,
  };
}
export function gotoChat() {
  return new Promise(function t(resolve) {
    setTimeout(() => {
      browserHistory.push('/MyChat');
      resolve();
    }, 10000);
  });
}
export function gotoHome() {
  return new Promise(function t(resolve) {
    setTimeout(() => {
      browserHistory.push('/');
      resolve();
    }, 10000);
  });
}

