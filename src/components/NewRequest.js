import * as React from 'react';
import { Button, ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import axios from 'axios';

class NewRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userSelectedType: null,
    };
  }

  render() {
    const state = this.state;
    return (
      <div className="row">
        <div className="form-group col-sm-2">
          <ButtonToolbar className="fullWidth">
            <ToggleButtonGroup onChange={(sender) => { this.setState({ userSelectedType: sender }); }} type="radio" className="fullWidth" name="options">
              <ToggleButton className="onlyTopBorderRadus fullWidth" value={1}>I Need</ToggleButton><br />
              <ToggleButton className="onlyBottemBorderRadus fullWidth" value={2}>I Have</ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
        </div>
        <div className="form-group col-sm-3">
          <input ref="txtAmout" type="text" style={{ height: '70px' }} id="txtAmout" className="form-control text-center"
            placeholder="Amount Money" required ref="txtAmout" />
        </div>
        <div className="col-sm-3">
          <select className="form-control" id="drpCurrency" style={{ height: '70px' }} required
            ref="drpCurrency">
            <option value="">--Select Currency--</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="IRR">IRR</option>
            <option value="CAD">CAD</option>
          </select>
        </div>
        <div className="col-sm-3">
          <select className="form-control" id="drpCountry" style={{ height: '70px' }} required
            ref="drpCountry">
            <option value="">--Select Country--</option>
            <option value="Iran">Iran</option>
            <option value="Germany">Germany</option>
            <option value="United States">US</option>
            <option value="Canada">Canada</option>
          </select>
        </div>
        <div className="col-sm-1">
          <Button onClick={test} style={{ height: '70px' }}>change</Button>
        </div>
      </div>
    );

    function test() {
      axios.post('/post',
        {
          type: 'addNewRequest',
          isNeed: state.userSelectedType,
          amount: txtAmout.value,
          currency: drpCurrency.value,
          country: drpCountry.value,
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
  }
}
export default NewRequest;
