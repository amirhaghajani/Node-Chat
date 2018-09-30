import React from 'react';
import { connect } from 'react-redux';
import Chat from '../components/Chat';
import { Link, IndexLink } from 'react-router';
import {
  setCurrentUserID,
  addMessage,
  addHistory,
  addUser,
  removeUser,
  addTypingUser,
  removeTypingUser,
} from '../actions/chat';
import {subscribe, history} from '../socket';

function mapStateToProps(state) {
  return {
    history: state.chat.get('messages').toJS(),
    userID: state.chat.get('userID'),
    lastMessageTimestamp: state.chat.get('lastMessageTimestamp'),
    users: state.chat.get('users').toJS(),
    usersTyping: state.chat.get('usersTyping').toJS(),
    myChatSelectedUserId: state.app.get('myChatSelectedUserId'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addMessage: (message) => dispatch(addMessage(message)),
    setUserID: (userID) => dispatch(setCurrentUserID(userID)),
    addHistory: (messages, timestamp) => dispatch(addHistory(messages, timestamp)),
    addUser: (userID) => dispatch(addUser(userID)),
    removeUser: (userID) => dispatch(removeUser(userID)),
    addTypingUser: (userID) => dispatch(addTypingUser(userID)),
    removeTypingUser: (userID) => dispatch(removeTypingUser(userID)),
  };
}

class MyChatContainer extends React.Component {
  static propTypes = {
    history: React.PropTypes.array,
    userID: React.PropTypes.number,
    addMessage: React.PropTypes.func,
    setUserID: React.PropTypes.func,
    addHistory: React.PropTypes.func,
    lastMessageTimestamp: React.PropTypes.string,
    users: React.PropTypes.array,
    addUser: React.PropTypes.func,
    removeUser: React.PropTypes.func,
    usersTyping: React.PropTypes.array,
    addTypingUser: React.PropTypes.func,
    removeTypingUser: React.PropTypes.func,
    myChatSelectedUserId: React.PropTypes.string,
  };

  componentDidMount() {
    // this.PubNub.subscribe({
    subscribe({
      channel: 'ReactChat',
      message: this.props.addMessage,
      presence: this.onPresenceChange,
    });
    window.addEventListener('beforeunload', this.leaveChat);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.myChatSelectedUserId !== prevProps.myChatSelectedUserId) {
      this.fetchHistory(this.props.myChatSelectedUserId);
    }
  }

  componentWillUnmount() {
    this.leaveChat();
  }

  onPresenceChange = (presenceData) => {
    switch (presenceData.action) {
    case 'join':
      this.props.addUser(presenceData.uuid);
      break;
    case 'leave':
    case 'timeout':
      this.props.removeUser(presenceData.uuid);
      break;
    case 'state-change':
      if (presenceData.data) {
        if (presenceData.data.isTyping === true) {
          this.props.addTypingUser(presenceData.uuid);
        } else {
          this.props.removeTypingUser(presenceData.uuid);
        }
      }
      break;
    default:
      break;
    }
  }

  render() {
    const { props, sendMessage, fetchHistory, setTypingState } = this;
    return (
      <div className="message-container">
      <div>myChat containter</div>
        <nav>
          <IndexLink to="/"
            activeClassName="active">Home</IndexLink>
          {" | "}
          <Link to="/MyChat" activeClassName="active">Chat - </Link>
        </nav>

        <Chat users={props.users} history={props.history} usersTyping={props.usersTyping}
            userID={props.userID} fetchHistory={fetchHistory} sendMessage={sendMessage}
            setTypingState={setTypingState}
            />
      </div>
    );
  }

  setTypingState = (isTyping) => {
    this.PubNub.state({
      channel: 'ReactChat',
      uuid: this.props.userID,
      state: { isTyping },
    });
  };

  leaveChat = () => {
    // this.PubNub.unsubscribe({ channel: 'ReactChat' });
  }

  fetchHistory = () => {
    const { props } = this;
    // this.PubNub.history({
    history({
      channel: 'ReactChat',
      count: 15,
      start: props.lastMessageTimestamp,
      callback: (data) => {
        console.log('data from myFetch - ' + JSON.stringify(data));
        // data is Array(3), where index 0 is an array of messages
        // and index 1 and 2 are start and end dates of the messages
        props.addHistory(data[0], data[1]);
      },
    });
  }

  sendMessage = (message) => {
    this.PubNub.publish({
      channel: 'ReactChat',
      message: message,
    });
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyChatContainer);
