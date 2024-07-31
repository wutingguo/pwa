import * as env from '@resource/pwa/services/env';
import * as braintree from '@resource/pwa/services/braintree';
import { paymentForSubscrible } from '@resource/pwa/services/payment';

export const getEnv = env.getEnv;

export const getBraintreeToken = (that, baseUrl) => {
  braintree.getBraintreeToken(baseUrl)
    .then(result => {
      const { token, payment_gateway } = result;
      that.setState({
        token,
        payment_gateway
      });
    })
    .catch(e => { });
};

export const handlePayment = async (that, creditToken, callback) => {
  const {
    subscribe_orders
  } = that.state;

  const {
    urls,
    boundGlobalActions
  } = that.props;
  const galleryBaseUrl = urls.get('galleryBaseUrl');

  const body = {
    subscribe_orders,
    nonce: creditToken,
    payment_gateway: 'BRAINTREE',
    save_card: true
  };

  return paymentForSubscrible(
    body,
    galleryBaseUrl, {
      enableNotify: false
    }).then(callback, errorMessage => {
      that.setState({
        isPaying: false,
        isLoading: false,
        errorMsg: errorMessage
      });
    });
};

export const payByToken = (creditToken, callback) => {
  const postData = {
    card_nonce: creditToken,
  };

  handlePayment(postData, callback);
};