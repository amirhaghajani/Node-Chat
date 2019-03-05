import * as React from 'react';
import axios from 'axios';
import { Scrollbars } from 'react-custom-scrollbars';
import InputRange from 'react-input-range';

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
      userSearch: null,
      amountMin: null,
      amountMax: null,
      unitPriceMin: null,
      unitPriceMax: null,
      valueAmount: { min: 0, max: 0 },
      valueUnitPrice: { min: 0, max: 0 },
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
    this.setState({ userSearch: userSearch });
    request.isNeed = true;
    this.postRequest(request, (data) => {
      const self = this;
      self.setState({
        items1: data.request.items,
        currentUserId: data.user,
        amountMax: data.request.amountMax.amount,
        amountMin: data.request.amountMin.amount,
        unitPriceMax: data.request.unitPriceMax.unitPrice,
        unitPriceMin: data.request.unitPriceMin.unitPrice,
        valueAmount: { min: data.request.amountMin.amount, max: data.request.amountMax.amount },
        valueUnitPrice: { min: data.request.unitPriceMin.unitPrice, max: data.request.unitPriceMax.unitPrice },
      });
    });

    request.isNeed = false;
    this.postRequest(request, (data) => {
      const self = this;
      self.setState({
        items2: data.request.items,
        currentUserId: data.user,
        amountMax: data.request.amountMax.amount,
        amountMin: data.request.amountMin.amount,
        unitPriceMax: data.request.unitPriceMax.unitPrice,
        unitPriceMin: data.request.unitPriceMin.unitPrice,
        valueAmount: { min: data.request.amountMin.amount, max: data.request.amountMax.amount },
        valueUnitPrice: { min: data.request.unitPriceMin.unitPrice, max: data.request.unitPriceMax.unitPrice },
      });
    });
  }

  getMoreData(isNeed) {
    let request = { type: 'allRequest' };
    if (this.state.userSearch) request = { ...request, ...this.state.userSearch };
    request.isNeed = isNeed;

    let items = [];
    if (isNeed) {
      items = this.state.items1;
    } else {
      items = this.state.items2;
    }
    if (!items || items.length === 0) return;
    request.lastInsertDate = items[items.length - 1].date;

    this.postRequest(request, (data) => {
      const self = this;
      if (isNeed) {
        self.setState({ items1: [...self.state.items1, ...data.request.items], currentUserId: data.user });
      } else {
        self.setState({ items2: [...self.state.items2, ...data.request.items], currentUserId: data.user });
      }
    });
  }

  render() {
    const { props, monthNames, state } = this;
    return (
      <div className="entries">
        <div className="intro wrap">
          <div className="search cf" style={{backgroundColor: '#333'}}>
            <div className="search-type">
            </div>
            <div>
              <div className="search-param">
                <select id="drpCountry" required
                  ref="drpCountry">
                  <option value="" disabled selected>Country</option>
                  <option value="Iran">Iran</option>
                  <option value="Germany">Germany</option>
                  <option value="United States">US</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
              <div className="search-param">
                <select id="drpCurrency" required
                  ref="drpCurrency">
                  <option value="" disabled selected>Currency</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="IRR">IRR</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
              <div className="search-param">
                <input ref="txtAmout" type="text" id="txtAmout"
                  placeholder="Amount" required />
              </div>
              <div className="search-param">
                <input ref="txtUnitPrice" type="text" id="txtUnitPrice"
                  placeholder="Unit Price" required />
              </div>
            </div>
            <div className="search-submit">
              <img src="/src/img/search.png" />
            </div>
          </div>
        </div>
        <div className="search-param" style={{ width: '20%' }}>
          <InputRange
            maxValue={state.amountMax}
            minValue={state.amountMin}
            value={state.valueAmount}
            onChange={valueAmount => this.setState({ valueAmount })} />
        </div>
        <div className="search-param" style={{ width: '20%' }}>
          <InputRange
            maxValue={state.unitPriceMax}
            minValue={state.unitPriceMin}
            value={state.valueUnitPrice}
            onChange={valueUnitPrice => this.setState({ valueUnitPrice })} />
        </div>


        <div className="wrap cf">
          <section className="drivers col cf">
            <div className="entries-heading cf">
              <h2 className="pull-left entries-title">Looking for a seller?</h2>
            </div>
            <Scrollbars style={{ width: '100%', height: 300 }} onScrollFrame={onScrollIsNeedTrue.bind(this)}>
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
            <Scrollbars style={{ width: '100%', height: 300 }} onScrollFrame={onScrollIsNeedFalse.bind(this)} >
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
    function onScrollIsNeedTrue(v) {
      console.info(JSON.stringify(v));
      if (v.top === 1) {
        this.getMoreData(true);
      }
    }
    function onScrollIsNeedFalse(v) {
      console.info(JSON.stringify(v));
      if (v.top === 1) {
        this.getMoreData(false);
      }
    }
  }

  postRequest(request, fn) {
    const rr = { ...{}, ...request };
    axios.post('/post',
      rr, {
        headers: {
          'X-CSRF-Token': window._csrf,
        },
      })
      .then(function th(response) {
        if (response.data.hasError) {
          alert('Error in Get Requests - ' + response.data.errorMessage);
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
