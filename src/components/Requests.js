import * as React from 'react';
import axios from 'axios';

class NewRequest extends React.Component {
  static propTypes = {
    fnGoToChatWithUser: React.PropTypes.func,
    searchRequest: React.PropTypes.object,
  };
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      currentUserId: null,
    };
  }

  componentDidMount() {
    this.getAllRequests(null);
  }

  componentWillUpdate(nextProps) {
    console.log('Requests component - componentWillUpdate: ' + JSON.stringify(nextProps));
    let changed = false;

    if (nextProps.searchRequest !== null && props.searchRequest === null || nextProps.searchRequest === null && props.searchRequest !== null) {
      changed = true;
    }
    if (nextProps.searchRequest !== null && props.searchRequest !== null) {
      if (nextProps.searchRequest.amount !== props.searchRequest.amount) changed = true;
      if (nextProps.searchRequest.currency !== props.searchRequest.currency) changed = true;
      if (nextProps.searchRequest.country !== props.searchRequest.country) changed = true;
    }
    if (changed) {
      getAllRequests(nextProps.searchRequest);
    }
  }

  getAllRequests(userSearch) {
    const self = this;
    let request = {type: 'allRequest'};
    if (!userSearch) {
      request = {
        type: 'allRequest',
        amount: userSearch.amount,
        currency: userSearch.currency,
        country: userSearch.country,
      };
    }

    axios.post('/post',
      request, {
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
              <span className="entry-price" onClick={()=>test(item.user._id)}>
                { this.state.currentUserId && this.state.currentUserId !== item.user._id ? 'Chat' : null }
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
                  <span className="entry-price" onClick={()=>test(item.user._id)}>
                    { this.state.currentUserId && this.state.currentUserId !== item.user._id ? 'Chat' : null }
                  </span>
                </div>);
            })}
          </section>
        </div>
      </div>
    );
    function test(userId) {
      props.fnGoToChatWithUser(userId);
    }
  }

  self = this
}

export default NewRequest;
