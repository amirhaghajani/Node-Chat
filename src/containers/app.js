import React from 'react';
import { Link, IndexLink, browserHistory  } from 'react-router';
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
          <div>
            <button onClick={() => browserHistory.push('/MyChat')}>Go to /myChat</button>
          </div>
          <Link to="/MyChat" activeClassName="active">Chat</Link>
        </nav>

        <NewRequest />
    </div>
    );
  }
}

export default App;
