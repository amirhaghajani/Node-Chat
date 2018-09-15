import React from 'react';
import { Link, IndexLink } from 'react-router';
import NewRequest from '../components/NewRequest';

class App extends React.Component {
  static propTypes = {
  };

  componentDidMount() {
  }

  componentWillUnmount() {
  }
  render() {
    return (
      <div className="container-fluid">
        <nav>
          <IndexLink to="/"
            activeClassName="active">Home</IndexLink>
          {" | "}
          <Link to="/MyChat" activeClassName="active">Chat</Link>
        </nav>

        <NewRequest />
    </div>
    );
  }
}

export default App;
