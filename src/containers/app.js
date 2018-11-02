import React from 'react';
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
          <div className="intro-headline">
            <p><strong>Journeys are better together</strong></p>
            <p>Save money. Meet new people. <b>GoCarShare!</b></p>
          </div>
          <NewRequest />
          <Requests fn={props.addUserToChat}/>
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
