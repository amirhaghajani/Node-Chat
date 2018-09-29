import React from 'react';
import { Link, IndexLink  } from 'react-router';
import NewRequest from '../components/NewRequest';
import { connect } from 'react-redux';
import { actionTest } from '../actions/app';
import Requests from '../components/Requests';
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8080/packtchat');

function subscribeToTimer(cb) {
  socket.on('message', timestamp => cb(null, timestamp));
  socket.emit('message', { username: 111 });
}

function mapStateToProps() {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actionTest: () => dispatch(actionTest()),
  };
}

class App extends React.Component {
  static propTypes = {
    actionTest: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      timestamp: 'no timestamp yet',
    };
  }

  componentDidMount() {
    subscribeToTimer((err, timestamp) => {
      console.log(timestamp);
      this.setState({
        timestamp: timestamp.message,
      });
      console.log(JSON.stringify(this.state));
    });
  }

  componentWillUnmount() {
  }

  render() {
    const { props } = this;
    function sendMessage(msg) {
      socket.emit('sendMessageToUser', msg);
    }
    return (
      <div className="container-fluid">
        <nav>
          <IndexLink to="/"
            activeClassName="active">Home</IndexLink>
          {" | "}
          <div>
            <button onClick={props.actionTest}>Go to myChat</button>
          </div>
          <Link to="/MyChat" activeClassName="active">Chat</Link>
        </nav>
        <div>{this.state.timestamp}</div>

        <NewRequest />
        <Requests fn={sendMessage}/>
    </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
