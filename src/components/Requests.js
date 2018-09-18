import * as React from 'react';
import axios from 'axios';

class NewRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [{amount: 1}, {amount: 2}],
    };
  }

  componentDidMount() {
    this.getAllRequests();
  }

  getAllRequests() {
    const self = this;
    axios.post('/post',
      {
        type: 'allRequest',
      }, {
        headers: {
          'X-CSRF-Token': window._csrf,
        },
      })
      .then( function th(response) {
        console.log(response);
        self.setState({items: response.data});
      })
      .catch(function ca(error) {
        alert('error');
        console.log(error);
      });
  }

  render() {
    return (
      <div>
      {this.state.items.map((item, index)=>{
        return (<div>{ index + ' - ' + item.amount}</div>);
      })}
      </div>
    );
  }

  self = this
}

export default NewRequest;
