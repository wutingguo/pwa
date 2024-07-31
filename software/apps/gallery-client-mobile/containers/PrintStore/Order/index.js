import { isEqual } from 'lodash';
import React, { Component } from 'react';

// import Payment from '@resource/components/Payment';
import StripePayment from '@resource/components/StripePayment';
import XButton from '@resource/components/XButton';
import XLoading from '@resource/components/XLoading';

import { getCountryCode } from '@resource/lib/utils/currency';

import { getCurrentCart, preparePayment } from '@apps/gallery-client/services/cart';
import { getStripePubKey } from '@apps/gallery-client/services/payment';

// import { widgetIdEnum } from '@resource/lib/constants/strings';
import './index.scss';

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: {},
      price: {},
      address: {},
      pubKey: '',
      errorText: '',
      loading: true,
      loadedStripeStatus: true,
    };
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(preProps) {
    const { store } = this.props;
    const { store: preStore } = preProps;
    if (!isEqual(store, preStore)) {
      this.init();
    }
  }

  init = async () => {
    const { store, urls, history } = this.props;
    const baseUrl = urls.get('estoreBaseUrl');
    const rackId = store.get('rackId');
    const storeId = store.get('id');
    if (!storeId) {
      return;
    }
    this.setState({
      loading: true,
    });
    const data = await getCurrentCart({ rackId, baseUrl });
    const pubKey = await getStripePubKey({ store_id: storeId, baseUrl });
    const {
      shipping: { address, method = {} },
      currency,
      price,
      cart_items,
    } = data;
    if (!cart_items || !price) {
      history.push('/printStore/shopping-cart');
      return;
    }
    this.setState({
      currency,
      price,
      address,
      loading: false,
      pubKey,
    });
  };

  submitOrder = async () => {
    const { urls, history } = this.props;
    const baseUrl = urls.get('estoreBaseUrl');
    if (!this.newCreditRef) {
      this.setState({
        loading: false,
      });
      return;
    }
    this.setState({
      loading: true,
      errorText: '',
    });
    const stripeInfo = await this.newCreditRef.onSubmit();
    console.log('stripeInfo: ', stripeInfo);
    const { id, type } = stripeInfo;

    if (type === 'validation_error' || type === 'api_connection_error') {
      this.setState({
        loading: false,
      });
      return;
    }

    preparePayment({
      channel: 'STRIPE',
      baseUrl,
      additional: {
        stripe_token: id,
      },
    })
      .then(res => {
        this.setState({
          loading: false,
        });
        history.push('/printStore/order-success');
      })
      .catch(err => {
        console.log('err: ', err);
        let errText = 'The payment failed to be processed. Please try again.';
        if (err === 401) {
          errText =
            'The conneted Stripe API Credentials are now invalid. Please contact the photographer.';
        }
        this.setState({
          loading: false,
          errorText: errText,
        });
      });
  };

  render() {
    const { price, currency, address, pubKey, loading, errorText, loadedStripeStatus } = this.state;
    console.log('loadedStripeStatus: ', loadedStripeStatus);
    const {
      receiver_name,
      address: addressLine1,
      address2: addressLine2,
      city,
      zip_code,
      country_name,
      country_code,
      receiver_phone,
    } = address;
    const {
      item_total = '',
      shipping_fee = '',
      tax = '',
      payable_amount = '',
      item_discount = 0,
    } = price;
    const { symbol = '', code = '' } = currency;

    const composeAddress = [
      addressLine1,
      addressLine2,
      city,
      country_code,
      zip_code,
      country_name,
    ].filter(item => !!item);

    const addressInfo = [
      {
        label: 'Ship to: ',
        key: 'name',
        value: receiver_name,
      },
      {
        label: '',
        key: 'address',
        value: composeAddress.join(', '),
      },
      {
        label: 'phone: ',
        key: 'phone',
        value: receiver_phone,
      },
    ];

    const amountInfo = [
      {
        label: 'Items Total:',
        key: 'itemsTotal',
        value: `${symbol}${item_total}`,
      },
      {
        label: 'Coupon Code:',
        key: 'Coupon',
        value: `-${symbol}${item_discount}`,
      },
      {
        label: 'Shipping:',
        key: 'shipping',
        value: `${symbol}${shipping_fee}`,
      },
      {
        label: 'Tax:',
        key: 'tax',
        value: `${symbol}${tax}`,
      },
    ];

    const paymentProps = {
      newCreditRef: node => (this.newCreditRef = node),
      loadedStripe: (status = true) => {
        if (!status) {
          this.setState({
            loading: false,
            loadedStripeStatus: false,
          });
        }
      },
      code,
      isMobile: true,
    };

    return (
      <div className="order-payment-page" style={{ height: window.innerHeight - 280 }}>
        <XLoading isShown={loading} backgroundColor="rgba(255,255,255,0.6)" />
        <StripePayment pubKey={pubKey} {...paymentProps} />
        <div className="order-payment-page-wrapper">
          <div className="billingInfo">
            <div className="address">
              {addressInfo.map(item => (
                <div className="addressItem" key={item.key}>
                  <div className="label">{item.label}</div>
                  <div className="value">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="amount">
              {amountInfo.map(item => (
                <div className="amountItem" key={item.key}>
                  <div className="label">{item.label}</div>
                  <div className="value">{item.value}</div>
                </div>
              ))}
              <div className="amountItem total">
                <div className="label">Total:</div>
                <div className="value">
                  <span>{`${symbol}${payable_amount}`}</span>
                  <span className="suffix">{code}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="message-container">
            <span className="check-out-disabled-message">{errorText}</span>
          </div>
        </div>
        <div className="btnWrapper">
          <XButton className="orderBtn" onClick={this.submitOrder} disabled={!loadedStripeStatus}>
            {t('PLACE_ORDER')}
          </XButton>
        </div>
      </div>
    );
  }
}

export default Order;
