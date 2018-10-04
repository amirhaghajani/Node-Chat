import React from 'react';
import ChatInput from './ChatInput';
import ChatHistory from './ChatHistory';
import ChatUsers from './ChatUsers';
import ChatUsersTyping from './ChatUsersTyping';

class Chat extends React.Component {
  static propTypes = {
    users: React.PropTypes.array,
    history: React.PropTypes.array,
    usersTyping: React.PropTypes.array,
    userID: React.PropTypes.number,

    fetchHistory: React.PropTypes.func,
    sendMessage: React.PropTypes.func,
    setTypingState: React.PropTypes.func,
  };

  render() {
    const { props } = this;
    return (
      <div className="message-container">
        <ChatUsers users={props.users} />
        <ChatHistory history={props.history} fetchHistory={props.fetchHistory} />
        <ChatUsersTyping usersTyping={props.usersTyping} />
        <ChatInput userID={props.userID} sendMessage={props.sendMessage} setTypingState={props.setTypingState} />
      </div>
    );
  }
}

export default Chat;
