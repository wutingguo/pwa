import React, { Component } from 'react';
import './index.scss';
class SelfPricingCollapseCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      element: props.element,
      isOpened: true
    };
  }
  componentDidMount() {}

  componentWillReceiveProps(o, n) {}

  changeEvent(e) {
    const { element } = this.props;
    const val = this.updatePrice(e.target.value.toString());
    if (element && element.skuObj) {
      const skuAttr = element.skuObj;
      skuAttr.suggested_price = val;
      this.setState({
        element
      });
    }
  }

  changeShippingEvent(e) {
    const { element } = this.props;
    const val = this.updatePrice(e.target.value.toString());
    if (element && element.skuObj) {
      const skuAttr = element.skuObj;
      skuAttr.addition_shipping_fee = val;
      this.setState({
        element
      });
    }
  }

  updatePrice(value) {
    const onChangePrice = this.props.onChangePrice;
    onChangePrice();
    let val = value.toString();
    val = val.replace(/[^\d.]/g, '');
    val = val.replace(/\.{2,}/g, '.');
    val = val.replace(/^0+\./g, '0.');
    val = val.match(/^0+[1-9]+/) ? (val = val.replace(/^0+/g, '')) : val;
    val = val.match(/^\d*(\.?\d{0,2})/g)[0] || '';
    if (val == '.') {
      val = '0.';
    }
    return val;
  }

  onBlur(e) {
    const { element } = this.props;
    if (element && element.skuObj) {
      const skuAttr = element.skuObj;
      skuAttr.suggested_price = Number(skuAttr.suggested_price).toFixed(2);
      skuAttr.addition_shipping_fee = Number(skuAttr.addition_shipping_fee).toFixed(2);
      this.setState({
        element
      });
    }
  }
  render() {
    const { element, rackSpuDetail } = this.props;
    let skuAttr = {};
    if (element && element.skuObj) {
      skuAttr = element.skuObj;
    }
    return (
      <div className="estore-pricing-collapse-self-cell">
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
          rackSpuDetail.spu_type == 2 ? (
            <div className="empty-price-container"></div>
          ) : (
            <div className="input-price-container">
              <span className="price-symbol">$</span>
              <input
                className="input-price"
                maxLength={12}
                type="text"
                onChange={e => this.changeEvent(e)}
                onBlur={e => this.onBlur(e)}
                value={skuAttr.suggested_price}
              ></input>
            </div>
          )
        ) : null}
        {skuAttr && skuAttr.sku_uuid ? (
          <div className="input-price-container self">
            <span className="price-symbol">$</span>
            {rackSpuDetail.spu_type == 2 ? (
              <input
                className="input-price"
                maxLength={12}
                type="text"
                onChange={e => this.changeEvent(e)}
                onBlur={e => this.onBlur(e)}
                value={skuAttr.suggested_price}
              ></input>
            ) : (
              <input
                className="input-price"
                maxLength={12}
                type="text"
                onChange={e => this.changeShippingEvent(e)}
                onBlur={e => this.onBlur(e)}
                value={skuAttr.addition_shipping_fee}
              ></input>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

export default SelfPricingCollapseCell;