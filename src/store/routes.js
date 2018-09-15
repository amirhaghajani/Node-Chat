import React from 'react';
import { Route } from 'react-router';
import App from '../containers/app';
import MyChatContainer from '../containers/myChatContainer';

export default (
  [
    <Route path="/" component={App} />,
    <Route path="/MyChat" component={MyChatContainer} />,
  ]
);
