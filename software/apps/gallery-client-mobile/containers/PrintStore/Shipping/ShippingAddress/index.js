import React, { Component } from 'react';
import ShippingNewAddress from '../ShippingNewAddress';
import ShippingCNAddress from '../ShippingCNAddress';

import './index.scss';

class ShippingAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowValidTip: false
    };
  }

  handleSelectAddress = () => {
    window.logEvent.addPageEvent({
      name: 'US_PC_Checkout_SelectNewAddInCheckout',
      timestamp: Date.now()
    });
  };

  handleEditAddress = addressID => {
    if (!addressID) {
      return;
    }
  };

  onTipMouseEnter = () => {
    this.setState({
      isShowValidTip: true
    });
  };

  onTipMouseLeave = () => {
    this.setState({
      isShowValidTip: false
    });
  };

  render() {
    const {
      address,
      currency,
      newAddressFormRef,
      saveAddressData,
      getAutomaticData,
      getCurrentCartData,
      estoreBaseUrl,
      onSelectUsOrCa
    } = this.props;
    const actionProps = {
      saveAddressData,
      getAutomaticData,
      getCurrentCartData,
      onSelectUsOrCa
    };

    return (
      <div className="checkout-shipping-address-wrap">
        <div className="shipping-header">
          <span className="shipping-header-topic">{t('CHECKOUT_SHIPPING_ADDRESS')}</span>
          {/* {!isEmptyAddress && (
            <span className="shipping-header-handle" onClick={this.handleSelectAddress}>
              {t('CHECKOUT_SELECT_NEW_ADDRESS')}
            </span>
          )} */}
        </div>
        <div className="checkout-shipping-address-content empty-address">
          {__isCN__ ? (
            <ShippingCNAddress
              estoreBaseUrl={estoreBaseUrl}
              currency={currency}
              ref={newAddressFormRef}
              address={address}
              {...actionProps}
            />
          ) : (
            <ShippingNewAddress
              address={address}
              currency={currency}
              estoreBaseUrl={estoreBaseUrl}
              ref={newAddressFormRef}
              {...actionProps}
            />
          )}
        </div>
      </div>
    );
  }
}

export default ShippingAddress;
