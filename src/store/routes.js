import React from 'react';
import { Route } from 'react-router';
import App from '../containers/app';
import MyChatContainer from '../containers/myChatContainer';

export default (
  [
    <Route key={1} path="/" component={App} />,
    <Route key={2} path="/MyChat" component={MyChatContainer} />,
  ]
);
