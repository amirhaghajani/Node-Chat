import React from 'react';
import { Link, IndexLink  } from 'react-router';
import NewRequest from '../components/NewRequest';
import { connect } from 'react-redux';
import { addUserToChat } from '../actions/app';
import Requests from '../components/Requests';

function mapStateToProps() {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addUserToChat: (userId) => dispatch(addUserToChat(userId)),
  };
}

class App extends React.Component {
  static propTypes = {
    addUserToChat: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const { props } = this;
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

        <NewRequest />
        <Requests fn={props.addUserToChat}/>
    </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
