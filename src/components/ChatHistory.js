import * as React from 'react';
import * as ReactDOM from 'react-dom';

class ChatHistory extends React.Component {
  static propTypes = {
    history: React.PropTypes.array,
    fetchHistory: React.PropTypes.func,
    goScrollToBottom: React.PropTypes.number,
    userID: React.PropTypes.number,
  };

  componentWillUpdate(nextProps) {
    const goToBottom = nextProps.goScrollToBottom !== this.props.goScrollToBottom && nextProps.goScrollToBottom > 0;
    this.historyChanged = nextProps.history.length !== this.props.history.length;
    if (this.historyChanged) {
      const { messageList } = this.refs;
      const scrollPos = messageList.scrollTop;
      const scrollBottom = (messageList.scrollHeight - messageList.clientHeight);
      this.scrollAtBottom = goToBottom || (scrollBottom === 0) || (scrollPos === scrollBottom);
      console.log('historyChanged: ' + this.historyChanged + ' scrollAtBottom: ' + this.scrollAtBottom + ' goToBottom: ' + goToBottom);

      this.topMessage = null;
      if (!this.scrollAtBottom) {
        const numMessages = messageList.childNodes.length;
        this.topMessage = numMessages === 0 ? null : messageList.childNodes[0];
      }
    }
  }

  componentDidUpdate() {
    if (this.historyChanged) {
      if (this.scrollAtBottom) {
        this.scrollToBottom();
      }
      if (this.topMessage) {
        ReactDOM.findDOMNode(this.topMessage).scrollIntoView();
      }
    }
  }

  onScroll = () => {
    const { refs, props } = this;
    const scrollTop = refs.messageList.scrollTop;
    if (scrollTop === 0) {
      props.fetchHistory();
    }
  };

  render() {
    const { props, onScroll } = this;
    return (
      <ul className="collection message-list" ref="messageList" onScroll={ onScroll }>
        { props.history.map((messageObj) => {
          const messageDate = new Date(messageObj.When);
          const messageDateTime = messageDate.toLocaleDateString() +
            ' at ' + messageDate.toLocaleTimeString();
          return (
            <li className="collection-item message-item" key={ messageObj.When }>
              <div className={messageObj.Who === props.userID ? 'message-containerDiv-me' : 'message-containerDiv-other'}>
                <div className={messageObj.Who === props.userID ? 'message-title-me' : 'message-title-other'}>
                    <span className="message-who">{messageObj.Who === props.userID ? '' : messageObj.WhoTitle}</span>
                    <span className="message-date">{ messageDateTime }</span>
                </div>
                <div className={messageObj.Who === props.userID ? 'message-whatDiv-me' : 'message-whatDiv-other'}>
                  <span className="message-what">{ messageObj.What }</span>
                </div>
              </div>
            </li>
          );
        }) }
      </ul>
    );
  }

  static scrollAtBottom = true;

  scrollToBottom = () => {
    const { messageList } = this.refs;
    const scrollHeight = messageList.scrollHeight;
    const height = messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    ReactDOM.findDOMNode(messageList).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }
}

export default ChatHistory;
