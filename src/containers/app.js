import React from 'react';
import { Link, IndexLink } from 'react-router';

class App extends React.Component {
  static propTypes = {
  };

  componentDidMount() {
  }

  componentWillUnmount() {
  }
  render() {
    console.log('render - App');
    return (
      <div className="message-container">
      <div>app container</div>
        <nav>
          <IndexLink to="/"
            activeClassName="active">Home</IndexLink>
          {" | "}
          <Link to="/MyChat" activeClassName="active">Chat</Link>
        </nav>
    </div>
    );
  }
}

export default App;
