import * as React from 'react';

class ChatInput extends React.Component {
  static propTypes = {
    userID: React.PropTypes.number,
    sendMessage: React.PropTypes.func,
    setTypingState: React.PropTypes.func,
    myChatSelectedUserId: React.PropTypes.number,
  };

  componentDidMount() {
    this.refs.txtMessage.focus();
  }

  onSubmit = (e) => {
    e.preventDefault();
    console.log('userID: ' + this.props.userID + ' - myChatSelectedUserId: ' + this.props.myChatSelectedUserId);
    if (!this.props.myChatSelectedUserId) return;

    // Check if the message is empty
    const message = this.refs.txtMessage.value;
    if (message.length === 0) {
      return;
    }
    // Build a message object and send it
    const messageObj = {
      Who: this.props.userID,
      What: message,
      When: new Date().valueOf(),
    };
    this.props.sendMessage(messageObj);

    // Clear the input field and set focus
    this.refs.txtMessage.value = '';
    this.refs.txtMessage.focus();
  };

  onChange = () => {
    const { resetStopTypingTimeout } = this;
    const { setTypingState } = this.props;
    const isInputEmpty = (this.refs.txtMessage.value.length === 0);

    // If the input isn't empty, and isTyping is false, update the state
    if (isInputEmpty === false) {
      // If the user wasn't typing before, and now the event has fired,
      // it means they are now typing
      if (this.isTyping === false) {
        this.isTyping = true;
        setTypingState(this.isTyping);
        // Start a 3 second countdown to see if they type within that window
        resetStopTypingTimeout();
      } else {
        // If the user typed another character, reset the timeout
        resetStopTypingTimeout();
      }
    } else {
      if (this.isTyping === true) {
        // If the user was typing, but now the input is empty,
        // it means they've deleted everything and that triggered
        // an onChange event.  For this, we state they have stopped typing
        this.isTyping = false;
        setTypingState(this.isTyping);
        // Stop the timeout, if there is one running
        if (this.stopTypingTimeout) {
          clearTimeout(this.stopTypingTimeout);
          this.stopTypingTimeout = undefined;
        }
      }
    }
  };

  render() {
    const { onSubmit, onChange } = this;
    // const { props, onSubmit, onChange } = this;
    // const imgURL = '//robohash.org/' + props.userID + '?set=set2&bgset=bg2&size=70x70';
    return (
      <footer className="message-form">
        <form className="frmSend" onSubmit={ onSubmit }>
            <div className="frmSend-InputDiv">
              <input style={{width: '100%'}} ref="txtMessage" type="text" placeholder="Type your message" onChange={ onChange } />
            </div>
            <div className="frmSend-ButtonDiv">
              <button type="submit" className="btn btn-secondary color_orange_background">Send</button>
            </div>
        </form>
      </footer>
    );
  }

  isTyping = false;
  stopTypingTimeout = undefined;

  resetStopTypingTimeout = () => {
    const { stopTypingTimeout } = this;
    if (stopTypingTimeout) {
      clearTimeout(stopTypingTimeout);
    }
    this.stopTypingTimeout = setTimeout(() => {
      this.isTyping = false;
      this.props.setTypingState(this.isTyping);
      this.stopTypingTimeout = undefined;
    }, 3000);
  };
}

export default ChatInput;
