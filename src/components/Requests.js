import * as React from 'react';
import axios from 'axios';
import { Scrollbars } from 'react-custom-scrollbars';
import Search from './Search';

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
      searchHide: true,
      showDivSearch1: false,
      showDivSearch2: false,
      showDivSearch3: false,
      showDivSearch4: false,
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
      if (data.request.amountMax) {
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
      } else {
        self.setState({
          items1: data.request.items,
          currentUserId: data.user,
        });
      }
    });

    request.isNeed = false;
    this.postRequest(request, (data) => {
      const self = this;
      if (data.request.amountMax) {
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
      } else {
        self.setState({
          items2: data.request.items,
          currentUserId: data.user,
        });
      }
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
    const { showDivSearch1, showDivSearch2, showDivSearch3, showDivSearch4 } = state;
    return (
      <div className="entries">
        <div id="divSearch1">
          <Search isFull="true" fnSearch={this.getAllRequests.bind(this)} isHide={!showDivSearch1} unitPriceMax={state.unitPriceMax} unitPriceMin={state.unitPriceMin}
            amountMax={state.amountMax} amountMin={state.amountMin} />
        </div>
        <div id="divSearch2">
          <Search isFull="true" fnSearch={this.getAllRequests.bind(this)} isHide={!showDivSearch2} unitPriceMax={state.unitPriceMax} unitPriceMin={state.unitPriceMin}
            amountMax={state.amountMax} amountMin={state.amountMin} />
        </div>
        <div className="wrap cf">
          <section className="drivers col cf">
            <div id="divSearch3" className="entries-heading cf">
              <Search isFull="false" fnSearch={this.getAllRequests.bind(this)} isHide={!showDivSearch3} unitPriceMax={state.unitPriceMax} unitPriceMin={state.unitPriceMin}
                amountMax={state.amountMax} amountMin={state.amountMin} />
              <h2 className="pull-left entries-title">Looking for a seller?</h2>
              <img className="imgSearch" src="/src/img/search.png"
                onClick={imgSearchClick.bind(this, 1)} />
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
            <div id="divSearch4" className="entries-heading cf">
              <Search isFull="false" fnSearch={this.getAllRequests.bind(this)} isHide={!showDivSearch4} unitPriceMax={state.unitPriceMax} unitPriceMin={state.unitPriceMin}
                amountMax={state.amountMax} amountMin={state.amountMin} />
              <h2 className="pull-left entries-title">Looking for a buyer?</h2>
              <img className="imgSearch" src="/src/img/search.png"
                onClick={imgSearchClick.bind(this, 2)} />
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
    function imgSearchClick(img) {
      const top1 = document.getElementById('divSearch3').offsetTop;
      const top2 = document.getElementById('divSearch4').offsetTop;
      const show = state.searchHide;
      if (!show) {
        if ((img === 1 && (this.state.showDivSearch1 || this.state.showDivSearch3)) ||
          (img === 2 && (this.state.showDivSearch2 || this.state.showDivSearch4))) {
          this.setState({
            searchHide: true,
            showDivSearch1: false,
            showDivSearch2: false,
            showDivSearch3: false,
            showDivSearch4: false,
          });
          return;
        }
      }

      this.setState({
        searchHide: false,
        showDivSearch1: img === 1 && top1 === top2,
        showDivSearch2: img === 2 && top1 === top2,
        showDivSearch3: img === 1 && top1 !== top2,
        showDivSearch4: img === 2 && top1 !== top2,
      });
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
