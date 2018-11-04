import React from 'react';
import NewRequest from '../components/NewRequest';
import { connect } from 'react-redux';
import { addUserToChat, searchRequests } from '../actions/app';
import Requests from '../components/Requests';

function mapStateToProps(state) {
  return {
    userRequestSearch: state.app.get('userRequestSearch'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addUserToChat: (userId) => dispatch(addUserToChat(userId)),
    searchRequests: (searchInfo) => dispatch(searchRequests(searchInfo)),
  };
}

class App extends React.Component {
  static propTypes = {
    addUserToChat: React.PropTypes.func,
    searchRequests: React.PropTypes.func,
    userRequestSearch: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      rootSize: window.getRootWidth2(),
    };
    const self = this;
    window.goChat = function goChat() {
      self.props.addUserToChat(null);
    };
  }

  componentDidMount() {
    // window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const { props } = this;
    return (
      <div>
        <div className="intro wrap">
            <div className="intro-headline">
              <p><strong>Wecare, Weshare, Wechange</strong></p>
              <p>Exchange safe, easy, fast</p>
            </div>
            <NewRequest searchRequests={props.searchRequests} />
        </div>
        <Requests searchRequest={props.userRequestSearch} fnGoToChatWithUser={props.addUserToChat}/>
      </div>
    );
  }

  handleResize() {
    const width = window.getRootWidth2();
    if (width === this.state.rootSize) return;
    this.setState({rootSize: window.getRootWidth()});
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
