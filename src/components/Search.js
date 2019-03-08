import * as React from 'react';
import InputRange from 'react-input-range';

class Search extends React.Component {
  static propTypes = {
    isHide: React.PropTypes.boolean,
    unitPriceMax: React.PropTypes.number,
    unitPriceMin: React.PropTypes.number,
    amountMax: React.PropTypes.number,
    amountMin: React.PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      valueAmount: { min: 0, max: 0 },
      valueUnitPrice: { min: 0, max: 0 },
    };
  }
  componentDidUpdate(prevProps) {
    if (!this.props.amountMax || prevProps.amountMax === this.props.amountMax) return;
    console.info('search componentDidUpdate - this.props.amountMax: ' + this.props.amountMax);
    this.state = {
      valueAmount: { min: this.props.amountMin, max: this.props.amountMax },
      valueUnitPrice: { min: this.props.unitPriceMin, max: this.props.unitPriceMax },
    };
  }
  render() {
    const { props, state } = this;
    const { amountMax, amountMin, unitPriceMax, unitPriceMin } = props;
    return (
      <div className="intro wrap" style={{ paddingBottom: '10px' }}>
        <div className="search cf searchBackDiv">
          <div className={props.isHide ? 'search-type searchHide' : 'search-type searchHide active'}>
          </div>
          <div className={props.isHide ? 'searchHide' : 'searchHide active'}>
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
              {amountMax ? <InputRange
                  maxValue={amountMax}
                  minValue={amountMin}
                  value={state.valueAmount}
                  onChange={valueAmount => this.setState({ valueAmount })} /> : null
                  }
              </div>
            </div>
            <div className="search-param">
              <div className="inputRangeContainer">
                {unitPriceMax ? <InputRange
                  maxValue={unitPriceMax}
                  minValue={unitPriceMin}
                  value={state.valueUnitPrice}
                  onChange={valueUnitPrice => this.setState({ valueUnitPrice })} /> : null
                }
              </div>
            </div>
          </div>
          <div className="search-submit" style={{ width: '93px', textAlign: 'right', backgroundColor: 'white' }}>
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
