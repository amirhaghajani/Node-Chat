import * as React from 'react';
import axios from 'axios';

class NewRequest extends React.Component {
  static propTypes = {
    fn: React.PropTypes.func,
  };
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      currentUserId: null,
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
        if (response.data.hasError) {
          alert('Error in Get Requests - ' + response.data.erroreMessage);
          return;
        }
        self.setState({items: response.data.request, currentUserId: response.data.user});
      })
      .catch(function ca(error) {
        alert('error');
        console.log(error);
      });
  }

  render() {
    const { props } = this;
    return (
      <div className="entries">
        <div  className="wrap cf">
          <section className="drivers col cf">
            <div className="entries-heading cf">
              <h2 className="pull-left entries-title">Looking for a ride?</h2>
            </div>

            {this.state.items.map((item, index)=>{
              if (item.isNeed) return null;
              return (<div key={'R' + index} className="entry">
              <div className="entry-avatar">
                {item.user.name}
              </div>
              <span  className="entry-description">
                {item.country.name} {item.currency.name} {item.amount}
              </span>
              <span className="entry-price">
                { this.state.currentUserId && this.state.currentUserId !== item.user._id ? <button onClick={()=>test(item.user._id)}>Chat</button> : '  --' }
              </span>
            </div>);
            })}

          </section>

          <section className="passengers col cf">
            <div className="entries-heading cf">
              <h2 className="pull-left entries-title">Got a spare seat?</h2>
            </div>

            {this.state.items.map((item, index)=>{
              if (!item.isNeed) return null;
              return (
                <div key={'R' + index} className="entry">
                  <div className="entry-avatar">
                    {item.user.name}
                  </div>
                  <span  className="entry-description">
                    {item.country.name} {item.currency.name} {item.amount}
                  </span>
                  <span className="entry-price">
                    { this.state.currentUserId && this.state.currentUserId !== item.user._id ? <button onClick={()=>test(item.user._id)}>Chat</button> : '  --' }
                  </span>
                </div>);
            })}
          </section>
        </div>
      </div>
    );
    function test(userId) {
      props.fn(userId);
    }
  }

  self = this
}

export default NewRequest;
