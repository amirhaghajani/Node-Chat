import React from 'react';
import { connect } from 'react-redux';
import Chat from '../components/Chat';
import MyChatPeoples from '../components/MyChatPeoples';
import { Link } from 'react-router';
import {
  setCurrentUserID,
  addMessage,
  addHistory,
  addUser,
  removeUser,
  addTypingUser,
  removeTypingUser,
  getChatUsers,
  newUserSelectedForChat,
} from '../actions/chat';
import {subscribe, history, publish} from '../socket';

function mapStateToProps(state) {
  return {
    history: state.chat.get('messages').toJS(),
    userID: state.chat.get('userID'),
    lastMessageTimestamp: state.chat.get('lastMessageTimestamp'),
    users: state.chat.get('users').toJS(),
    usersTyping: state.chat.get('usersTyping').toJS(),
    myChatSelectedUserId: state.chat.get('myChatSelectedUserId'),
    chatUsers: state.chat.get('chatUsers'),
    refreshChatPage: state.chat.get('refreshChatPage'),
    goScrollToBottom: state.chat.get('goScrollToBottom'),
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
    getChatUsers: () => dispatch(getChatUsers()),
    newUserSelectedForChat: (userId) => dispatch(newUserSelectedForChat(userId)),
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
    getChatUsers: React.PropTypes.func,
    chatUsers: React.PropTypes.array,
    refreshChatPage: React.PropTypes.number,
    newUserSelectedForChat: React.PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      rootSize: window.getRootWidth(),
    };
  }

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
    if (this.props.refreshChatPage !== prevProps.refreshChatPage) {
      this.props.getChatUsers();
    }
    if (this.props.myChatSelectedUserId !== prevProps.myChatSelectedUserId) {
      this.fetchHistory(this.props.myChatSelectedUserId);
    }
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
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
      <div>
        <div style={{height: this.state.rootSize}} className="chatNavSideDiv">
          <div className="usersChatDiv">
            <MyChatPeoples myChatSelectedUserId={props.myChatSelectedUserId} users={props.chatUsers} newUserSelectedForChat={props.newUserSelectedForChat}/>
          </div>
          <div className="historyDiv">
            <Chat users={props.users} history={props.history} usersTyping={props.usersTyping}
              goScrollToBottom={props.goScrollToBottom} myChatSelectedUserId={props.myChatSelectedUserId}
              userID={props.userID} fetchHistory={fetchHistory} sendMessage={sendMessage.bind(this)}
              setTypingState={setTypingState} height={this.state.rootSize}
              />
          </div>
        </div>
      </div>
    );
  }

  handleResize() {
    const width = window.getRootWidth();
    if (width === this.state.rootSize) return;
    this.setState({rootSize: window.getRootWidth()});
  }

  // setTypingState = (isTyping) => {
  setTypingState = () => {
    // this.PubNub.state({
      // channel: 'ReactChat',
      // uuid: this.props.userID,
      // state: { isTyping },
    // });
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
      wantedUserId: props.myChatSelectedUserId,
      callback: (data) => {
        console.log('data from myFetch - ' + JSON.stringify(data));
        // data is Array(3), where index 0 is an array of messages
        // and index 1 and 2 are start and end dates of the messages
        props.addHistory(data[0], data[1]);
      },
    });
  }

  sendMessage = (message) => {
    publish({
      message: message,
      userId: this.props.myChatSelectedUserId,
    });
    this.props.addMessage(message);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyChatContainer);
