import React, { Component } from 'react';

import hiddenPng from '@resource/static/icons/handleIcon/notVisible.png';
import showPng from '@resource/static/icons/handleIcon/view.png';

import './index.scss';

class SelfPricingCollapseCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      element: props.element,
      isOpened: true,
    };
  }
  componentDidMount() {}

  componentWillReceiveProps(o, n) {}

  changeEvent(e, key, isDefault) {
    const { element, onChangePrice } = this.props;
    const value = e.target.value.toString();
    const val = this.updatePrice(value);
    if (element && element.skuObj) {
      if (key === 'suggested_price') {
        onChangePrice({
          ...element.skuObj,
          [key]: Number(val).toFixed(2),
          base_price: Number(val).toFixed(2),
          no_product_options: isDefault,
        });
      } else {
        onChangePrice({
          ...element.skuObj,
          [key]: Number(val).toFixed(2),
          no_product_options: isDefault,
        });
      }
      const skuAttr = element.skuObj;
      skuAttr[key] = val;
      this.setState({
        element,
      });
    }
  }

  changeVisible = key => {
    const { element, onChangePrice } = this.props;
    if (element && element.skuObj) {
      const { sku_status } = element.skuObj;
      console.log('element.skuObj: ', element.skuObj);
      const value = sku_status == 2 ? 3 : 2;
      onChangePrice({ ...element.skuObj, [key]: value });
      const skuAttr = element.skuObj;
      skuAttr[key] = value;
      this.setState({
        element,
      });
    }
  };

  updatePrice(value) {
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
      skuAttr.base_price = Number(skuAttr.base_price).toFixed(2);
      skuAttr.addition_shipping_fee = Number(skuAttr.addition_shipping_fee).toFixed(2);
      this.setState({
        element,
      });
    }
    window.logEvent.addPageEvent({
      name: 'Estore_Products_CustomizeSPU_Click_EditSKUPrice',
    });
  }
  render() {
    const { element, rackSpuDetail = {}, currency_symbol } = this.props;
    let skuAttr = {};
    if (element && element.skuObj) {
      skuAttr = element.skuObj;
    }
    const { no_product_options = false, sku_status } = skuAttr;
    const noLeftStyle = no_product_options
      ? {
          marginLeft: 0,
        }
      : {};
    return (
      <div className={`estore-pricing-collapse-self-cell ${sku_status == 3 ? 'gray' : ''}`}>
        {!no_product_options ? (
          <div className="title">
            <span>{element.display_name} </span>
          </div>
        ) : null}
        <div style={noLeftStyle} className="input-price-container" key="input_price">
          <span className="price-symbol">{currency_symbol || '$'}</span>
          <input
            className="input-price"
            maxLength={12}
            type="text"
            onChange={e => this.changeEvent(e, 'suggested_price', no_product_options)}
            onBlur={e => this.onBlur(e)}
            value={skuAttr.suggested_price}
          ></input>
        </div>
        <div className="input-price-container self" key="input_price_self">
          <span className="price-symbol">{currency_symbol || '$'}</span>
          <input
            className="input-price"
            maxLength={12}
            type="text"
            onChange={e => this.changeEvent(e, 'addition_shipping_fee', no_product_options)}
            onBlur={e => this.onBlur(e)}
            value={skuAttr.addition_shipping_fee}
          ></input>
        </div>
        {!no_product_options ? (
          <div className="visibleWrapper" key="visibility-icon">
            <img
              className="visibilityIcon"
              src={skuAttr.sku_status == 2 ? showPng : hiddenPng}
              onClick={() => this.changeVisible('sku_status')}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default SelfPricingCollapseCell;
