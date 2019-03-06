import * as React from 'react';
import InputRange from 'react-input-range';

const Search = () =>
<div className="intro wrap" style={{ paddingBottom: '10px' }}>
<div className="search cf searchBackDiv">
  <div className={state.searchHide ? 'search-type searchHide' : 'search-type searchHide active'}>
  </div>
  <div className={state.searchHide ? 'searchHide' : 'searchHide active'}>
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
      <div className="inputRangeContainer">
        <InputRange
          maxValue={state.amountMax}
          minValue={state.amountMin}
          value={state.valueAmount}
          onChange={valueAmount => this.setState({ valueAmount })} />
      </div>
    </div>
    <div className="search-param">
      <div className="inputRangeContainer">
        <InputRange
          maxValue={state.unitPriceMax}
          minValue={state.unitPriceMin}
          value={state.valueUnitPrice}
          onChange={valueUnitPrice => this.setState({ valueUnitPrice })} />
      </div>
    </div>
  </div>
  <div className="search-submit" style={{ width: '93px', textAlign: 'right', backgroundColor: 'white' }}>
  </div>
</div>
</div>;

export default Search;
