import * as React from 'react';
import axios from 'axios';
import { Scrollbars } from 'react-custom-scrollbars';

class NewRequest extends React.Component {
  static propTypes = {
    fnGoToChatWithUser: React.PropTypes.func,
    searchRequest: React.PropTypes.object,
  };
  constructor(props) {
    super(props);

    this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    this.state = {
      items1: [],
      items2: [],
      currentUserId: null,
    };
  }

  componentDidMount() {
    this.getAllRequests(null);
  }

  componentWillUpdate(nextProps) {
    console.log('Requests component - componentWillUpdate: ' + JSON.stringify(nextProps));
    if (nextProps === undefined || !nextProps) return;
    let changed = false;

    if ((nextProps.searchRequest !== null && this.props.searchRequest === null) ||
      (nextProps.searchRequest === null && this.props.searchRequest !== null)) {
      changed = true;
    }
    if (nextProps.searchRequest !== null && this.props.searchRequest !== null) {
      if (nextProps.searchRequest.amount !== this.props.searchRequest.amount) changed = true;
      if (nextProps.searchRequest.currency !== this.props.searchRequest.currency) changed = true;
      if (nextProps.searchRequest.country !== this.props.searchRequest.country) changed = true;
    }
    if (changed) {
      this.getAllRequests(nextProps.searchRequest);
    }
  }

  getAllRequests(userSearch) {
    let request = { type: 'allRequest' };
    if (userSearch) {
      request = {
        type: 'allRequest',
        amount: userSearch.amount,
        currency: userSearch.currency,
        country: userSearch.country,
      };
    }
    request.isNeed = true;
    this.postRequest(request, (data) => {
      const self = this;
      self.setState({ items1: data.request, currentUserId: data.user });
    });

    request.isNeed = false;
    this.postRequest(request, (data) => {
      const self = this;
      self.setState({ items2: data.request, currentUserId: data.user });
    });
  }

  render() {
    const { props, monthNames } = this;
    return (
      <div className="entries">
        <div className="wrap cf">
          <section className="drivers col cf">
            <div className="entries-heading cf">
              <h2 className="pull-left entries-title">Looking for a seller?</h2>
            </div>
            <Scrollbars style={{ width: '100%', height: 300 }}>
              {this.state.items1.map((item, index) => {
                return (<div key={'R' + index} className="entry">
                  <div className="entry-avatar">
                    <img src={'/static/usersImage/' + item.user._id + '.png'} />
                  </div>
                  <span className="entry-description-var">{item.user.name}</span>
                  <span className="entry-description"> needs </span>
                  <span className="entry-description-var">{numberWithCommas(item.amount)} </span>
                  <span className="entry-description-var">{item.currency.name}</span>
                  <span className="entry-description"> in </span>
                  <span className="entry-description-var">{item.country.name}</span><br />
                  <span className="entry-description-var">Unit price </span>
                  <span className="entry-description-var">{item.unitPrice ? numberWithCommas(item.unitPrice) : '-'}</span>
                  <span className="entry-description">
                    &nbsp;&nbsp;{new Date(item.date).getDate()}TH {monthNames[new Date(item.date).getMonth()]}
                  </span>
                  {
                    this.state.currentUserId && this.state.currentUserId !== item.user._id &&
                    <div className="entry-chat" onClick={() => test(item.user._id)}>
                      <img src="src/img/chat_support-512.png" />
                    </div>
                  }
                </div>);
              })}
            </Scrollbars>
          </section>

          <section className="passengers col cf">
            <div className="entries-heading cf">
              <h2 className="pull-left entries-title">Looking for a buyer?</h2>
            </div>
            <Scrollbars style={{ width: '100%', height: 300 }}>
              {this.state.items2.map((item, index) => {
                return (
                  <div key={'R' + index} className="entry">
                    <div className="entry-avatar">
                      <img src={'/static/usersImage/' + item.user._id + '.png'} />
                    </div>
                    <span className="entry-description-var">{item.user.name}</span>
                    <span className="entry-description"> sells </span>
                    <span className="entry-description-var">{numberWithCommas(item.amount)} </span>
                    <span className="entry-description-var">{item.currency.name}</span>
                    <span className="entry-description"> in </span>
                    <span className="entry-description-var">{item.country.name}</span><br />
                    <span className="entry-description-var">Unit price </span>
                    <span className="entry-description-var">{item.unitPrice ? numberWithCommas(item.unitPrice) : '-'}</span>
                    <span className="entry-description">
                      &nbsp;&nbsp;{new Date(item.date).getDate()}TH {monthNames[new Date(item.date).getMonth()]}
                    </span>
                    {
                      this.state.currentUserId && this.state.currentUserId !== item.user._id &&
                      <div className="entry-chat" onClick={() => test(item.user._id)}>
                        <img src="src/img/chat_support-512.png" />
                      </div>
                    }
                  </div>);
              })}
            </Scrollbars>
          </section>
        </div>
      </div>
    );
    function test(userId) {
      props.fnGoToChatWithUser(userId);
    }
    function numberWithCommas(x) {
      if (!x) return '';
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }

  postRequest(request, fn) {
    const rr = { ...{}, ...request};
    axios.post('/post',
      rr, {
        headers: {
          'X-CSRF-Token': window._csrf,
        },
      })
      .then(function th(response) {
        if (response.data.hasError) {
          alert('Error in Get Requests - ' + response.data.erroreMessage);
          return;
        }
        if (fn) fn(response.data);
      })
      .catch(function ca(error) {
        alert('error');
        console.log(error);
      });
  }
  self = this
}

export default NewRequest;
