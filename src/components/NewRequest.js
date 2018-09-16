import * as React from 'react';
import {Button, ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import axios from 'axios';

class NewRequest extends React.Component {

  render() {
    return (
            <div className="row">
                <div className="form-group col-sm-2">
                <ButtonToolbar className="fullWidth">
                    <ToggleButtonGroup type="radio" className="fullWidth" name="options">
                        <ToggleButton className="onlyTopBorderRadus fullWidth" value={1}>I Need</ToggleButton><br />
                        <ToggleButton className="onlyBottemBorderRadus fullWidth" value={2}>I Have</ToggleButton>
                    </ToggleButtonGroup>
                </ButtonToolbar>
                </div>
                <div className="form-group col-sm-3">
                    <input type="text" style={{height: '70px'}} id="email" className="form-control text-center"
                    placeholder="Amount Money" required ref="email"/>
                </div>
                <div className="col-sm-3">
                    <select className="form-control" id="drpCurrency" style={{height: '70px'}} required
                    ref="drpCurrency">
                    <option value="">--Select Currency--</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="IRR">IRR</option>
                    </select>
                </div>
                <div className="col-sm-3">
                    <select className="form-control" id="drpCountry" style={{height: '70px'}} required
                    ref="drpCountry">
                    <option value="">--Select Country--</option>
                    <option value="Iran">Iran</option>
                    <option value="Germany">Germany</option>
                    <option value="USA">USA</option>
                    </select>
                </div>
                <div className="col-sm-1">
                    <Button onClick={test} style={{height: '70px'}}>change</Button>
                </div>
            </div>
    );

    function test() {
      axios.post('/post', {
        firstName: 'Fred',
        lastName: 'Flintstone',
      })
        .then( function th(response) {
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
