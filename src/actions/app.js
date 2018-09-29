import { browserHistory  } from 'react-router';
import {
} from '../constants/app';

export function actionTest() {
  return (dispatch)=> {
    console.log('actionTest');
    dispatch(gotoChat()).then(()=>dispatch(gotoHome()));
  };
}
export function gotoChat() {
  const f = new Promise(function t(resolve) {
    setTimeout(() => {
      browserHistory.push('/MyChat');
      resolve();
    }, 2000);
  });
  return f;
}
export function gotoHome() {
  const f = new Promise(function t(resolve) {
    setTimeout(() => {
      browserHistory.push('/');
      resolve();
    }, 2000);
  });
  return ()=>{f;};
}

