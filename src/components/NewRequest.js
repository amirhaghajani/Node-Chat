import * as React from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

class NewRequest extends React.Component {
  static propTypes = {
    searchRequests: React.PropTypes.func,
    changeBtnDisable: React.PropTypes.bool,
  };
  constructor(props) {
    super(props);
    this.timeout1 = null;
    this.timeout2 = null;
    this.searchInfo = { unitPrice: null, amount: null, currency: null, country: null };

    this.state = {
      userSelectedType: null,
    };
  }

  render() {
    const state = this.state;
    const { changeBtnDisable } = this.props;
    return (
      <div className="search cf">
        <div className="search-type">
          <input type="radio" name="type" onChange={onTypeChanged.bind(this)} checked={this.state.userSelectedType === '1'} id="driver" value="1" />
          <label htmlFor="driver">I Need</label>
          <input type="radio" name="type" onChange={onTypeChanged.bind(this)} checked={this.state.userSelectedType === '2'} id="passenger" value="2" />
          <label htmlFor="passenger">I Have</label>
        </div>
        <div>
          <div className="search-param">
            <select onChange={onCountryChange.bind(this)} required
              ref="drpCountry">
              <option value="" disabled selected>Country</option>
              <option value="Iran">Iran</option>
              <option value="Germany">Germany</option>
              <option value="United States">US</option>
              <option value="Canada">Canada</option>
            </select>
          </div>
          <div className="search-param">
            <select onChange={onCurrencyChange.bind(this)} required
              ref="drpCurrency">
              <option value="" disabled selected>Currency</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="IRR">IRR</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
          <div className="search-param">
            <input ref="txtAmout" type="text"
              placeholder="Amount" required onChange={onAmountChange.bind(this)} />
          </div>
          <div className="search-param">
            <input ref="txtUnitPrice" type="text"
              placeholder="Unit Price" required onChange={onUnitPriceChange.bind(this)} />
          </div>
        </div>
        <div className="search-submit">
          <Button className={changeBtnDisable ? 'ir driver disabled' : 'ir driver'} onClick={fnChange.bind(this)}>change</Button>
        </div>
      </div>
    );

    function fnChange() {
      const self = this;
      axios.post('/post',
        {
          type: 'addNewRequest',
          isNeed: state.userSelectedType,
          amount: self.refs.txtAmout.value,
          currency: self.refs.drpCurrency.value,
          country: self.refs.drpCountry.value,
          unitPrice: self.refs.txtUnitPrice.value,
        }, {
          headers: {
            'X-CSRF-Token': window._csrf,
          },
        })
        .then(function th(response) {
          if (response.data.hasError) {
            alert(response.data.errorMessage);
            return;
          }
          self.refs.txtAmout.value = '';
          self.refs.txtUnitPrice.value = '';
          self.refs.drpCurrency.value = '';
          self.refs.drpCountry.value = '';
          self.setState({
            userSelectedType: '',
          });
          self.searchInfo = { amount: null, currency: null, country: null };
          self.props.searchRequests(null);
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
      this.searchInfo.country = this.refs.drpCountry.value;
      this.props.searchRequests(this.searchInfo);
    }

    function onCurrencyChange() {
      this.searchInfo.currency = this.refs.drpCurrency.value;
      this.props.searchRequests(this.searchInfo);
    }

    function amountChanged() {
      this.searchInfo.amount = { min: this.refs.txtAmout.value, max: null };
      this.props.searchRequests(this.searchInfo);
    }

    function onAmountChange() {
      if (this.timeout1) {
        clearTimeout(this.timeout1);
        this.timeout1 = null;
      }

      this.timeout1 = setTimeout(amountChanged.bind(this), 600);
    }

    function onUnitPriceChange() {
      if (this.timeout2) {
        clearTimeout(this.timeout2);
        this.timeout2 = null;
      }

      this.timeout2 = setTimeout(unitPriceChanged.bind(this), 600);
    }

    function unitPriceChanged() {
      this.searchInfo.unitPrice = { min: this.refs.txtUnitPrice.value, max: null };
      this.props.searchRequests(this.searchInfo);
    }
  }
}
export default NewRequest;
