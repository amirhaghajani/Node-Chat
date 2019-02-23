import * as React from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

class NewRequest extends React.Component {
  static propTypes = {
    searchRequests: React.PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.timeout = null;
    this.searchInfo = {amount: null, currency: null, country: null};

    this.state = {
      userSelectedType: null,
    };
  }

  render() {
    const state = this.state;
    return (
      <div className="search cf">
        <div className="search-type">
          <input type="radio" name="type" onChange={onTypeChanged.bind(this)} id="driver" value="1" />
          <label htmlFor="driver">I Need</label>
          <input type="radio" name="type" onChange={onTypeChanged.bind(this)} id="passenger" value="2" />
          <label htmlFor="passenger">I Have</label>
        </div>
        <div>
          <div className="search-param">
            <select id="drpCountry" onChange={onCountryChange.bind(this)} required
              ref="drpCountry">
              <option value="" disabled selected>Country</option>
              <option value="Iran">Iran</option>
              <option value="Germany">Germany</option>
              <option value="United States">US</option>
              <option value="Canada">Canada</option>
            </select>
          </div>
          <div className="search-param">
            <select id="drpCurrency" onChange={onCurrencyChange.bind(this)} required
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
              placeholder="Amount" required onChange={onAmountChange.bind(this)} />
          </div>
          <div className="search-param">
            <input ref="txtUnitPrice" type="text" id="txtunitPrice"
              placeholder="Unit Price" required onChange={onAmountChange.bind(this)} />
          </div>
        </div>
        <div className="search-submit">
          <Button className="ir driver" onClick={fnChange}>change</Button>
        </div>
      </div>
    );

    function fnChange() {
      axios.post('/post',
        {
          type: 'addNewRequest',
          isNeed: state.userSelectedType,
          amount: txtAmout.value,
          currency: drpCurrency.value,
          country: drpCountry.value,
          unitPrice: txtUnitPrice.value,
        }, {
          headers: {
            'X-CSRF-Token': window._csrf,
          },
        })
        .then(function th(response) {
          console.log(response);
        })
        .catch(function ca(error) {
          alert('error');
          console.log(error);
        });
    }

    function onTypeChanged(e) {
      this.setState({
        userSelectedType: e.currentTarget.value,
      });
    }

    function onCountryChange() {
      this.searchInfo.country = drpCountry.value;
      this.props.searchRequests(this.searchInfo);
    }

    function onCurrencyChange() {
      this.searchInfo.currency = drpCurrency.value;
      this.props.searchRequests(this.searchInfo);
    }

    function amountChanged() {
      this.searchInfo.amount = txtAmout.value;
      this.props.searchRequests(this.searchInfo);
    }

    function onAmountChange() {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }

      this.timeout = setTimeout(amountChanged.bind(this), 600);
    }
  }
}
export default NewRequest;
