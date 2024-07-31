import React, { Component } from 'react';
import './index.scss';
class PricingCollapseCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: true
    };
  }

  componentDidMount() {}

  changeEvent(e) {
    const onChangePrice = this.props.onChangePrice;
    onChangePrice();
    const { element } = this.props;
    let val = e.target.value.toString();
    val = val.replace(/[^\d.]/g, '');
    val = val.replace(/\.{2,}/g, '.');
    val = val.replace(/^0+\./g, '0.');
    val = val.match(/^0+[1-9]+/) ? (val = val.replace(/^0+/g, '')) : val;
    val = val.match(/^\d*(\.?\d{0,2})/g)[0] || '';
    if (val == '.') {
      val = '0.';
    }
    if (element && element.skuObj) {
      const skuAttr = element.skuObj;
      skuAttr.suggested_price = val;
      this.setState({
        element
      });
    }
  }

  onBlur(e) {
    const { element } = this.props;
    if (element && element.skuObj) {
      const skuAttr = element.skuObj;
      if (skuAttr) {
        skuAttr.suggested_price = Number(skuAttr.suggested_price).toFixed(2);
        this.setState({
          element
        });
      }
    }
  }
  render() {
    const { element } = this.props;
    const skuAttr = element.skuObj;
    return (
      <div className="estore-pricing-collapse-cell">
        <div className="collapse-cell-title-container">
          <div className="title">
            <span>{element.display_name} </span>
            {skuAttr && skuAttr.sku_uuid ? null : (
              <span>
                <spin>(</spin>
                <spin className="unavailable">{t('UNAVAILABLE1', 'unavailable')}</spin>
                <spin>)</spin>
              </span>
            )}
          </div>
          {skuAttr && skuAttr.sku_uuid ? (
            <div className="first-price">¥{skuAttr.base_price}</div>
          ) : null}
          {skuAttr && skuAttr.sku_uuid ? (
            <div className="second-price">
              ¥{(skuAttr.suggested_price - skuAttr.base_price).toFixed(2)}
            </div>
          ) : null}
          {skuAttr && skuAttr.sku_uuid ? (
            <div className="input-price-container">
              <span className="price-symbol">¥</span>
              <input
                className="input-price"
                maxLength={12}
                type="text"
                onChange={e => this.changeEvent(e)}
                onBlur={e => this.onBlur(e)}
                value={skuAttr.suggested_price}
              ></input>
            </div>
          ) : null}
        </div>
        {skuAttr && skuAttr.suggested_price - skuAttr.base_price <= 0 ? (
          <div className="hint">请注意当前产品的售价未大于成本。</div>
        ) : null}
      </div>
    );
  }
}

export default PricingCollapseCell;
