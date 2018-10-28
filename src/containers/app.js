import React from 'react';
import { IndexLink  } from 'react-router';
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
      rootSize: window.getRootWidth2(),
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const { props } = this;
    return (
      <div style={{minHeight: this.state.rootSize}} className="appContainer">
        <nav style={{ minHeight: this.state.rootSize }} className="appNav">
          <IndexLink to="/" activeClassName="navLink appPage-homeLink">
            <div class="navigate-node-wrapper">
              <i class="nav-icon biz-common-icon biz-common-icon-home"></i>
              <span class="navigate-text">Home</span>
            </div>
            Home
          </IndexLink>
          <div className="navLink" onClick={()=>props.addUserToChat(null)}>
            Chat
          </div>
        </nav>
        <div style={{ minHeight: this.state.rootSize }} className="requestContainer">
          <NewRequest />
          <Requests fn={props.addUserToChat}/>
        </div>
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
