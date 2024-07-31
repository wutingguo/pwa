import qs from 'qs';
import React from 'react';

import XPureComponent from '@resource/components/XPureComponent';

import { relativeUrl } from '@resource/lib/utils/language';

import { aiphotoInfo, saasProducts } from '@resource/lib/constants/strings';

import {
  getAIOrderPayment,
  getAISubscribeOrderStatus,
  getSubscribeOrderStatus,
  getWxOrderPayment,
} from '@resource/pwa/services/subscription';

import OrderDetails from './components/_OrderDetails';
import PaymentDetail from './components/_PaymentDetail';

import './index.scss';

class WxPayment extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      creditListloading: true,
      detailLoading: true,
      submitLoading: false,
      wxdata: {}, //页面数据
      checkedCreditCode: '',
      userInfo: {},
      showAlert: false,
      orderNumber: '',
      isTimeOut: false,
      seconds: 180,
      isOrderSuccessful: false,
      isShowQrCode: false,
      product_id: '',
    };
  }

  componentDidMount() {
    const urlParams = qs.parse(location.search.split('?')[1]);
    const { order_number, product_id, amount, deliveryCode } = urlParams;
    this.setState(
      {
        orderNumber: order_number,
        product_id,
      },
      () => {
        if (product_id === saasProducts.aiphoto || product_id === saasProducts.live) {
          this.getAIOrderPayment(amount, deliveryCode);
        } else {
          this.getQrCode(order_number);
        }
      }
    );

    this.timer = setInterval(() => {
      this.setState(
        preState => ({
          seconds: preState.seconds - 1,
        }),
        () => {
          console.log('product_id === saasProducts.aiphoto: ', product_id === saasProducts.aiphoto);
          if (this.state.seconds == 0) {
            this.setState({
              isTimeOut: true,
            });
            clearInterval(this.timer);
          } else if (product_id === saasProducts.aiphoto || product_id === saasProducts.live) {
            this.getAIOrderStatus(product_id);
          } else {
            this.getOrderStatus();
          }
        }
      );
    }, 3000);
  }

  getAIOrderPayment = (amount, deliveryCode) => {
    const { urls } = this.props;
    const { orderNumber } = this.state;
    const baseUrl = urls.get('baseUrl');
    const params = {
      baseUrl,
      payChannel: 'WEIXIN_PAY',
      amount,
      orderNo: orderNumber,
      deliveryCode,
    };
    getAIOrderPayment(params).then(res => {
      if (res) {
        this.setState({
          wxdata: {
            qrcode: res,
            amount: +amount,
          },
          isShowQrCode: true,
        });
      }
    });
  };

  getQrCode = () => {
    const { orderNumber, isOrderSuccessful } = this.state;
    const { urls } = this.props;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    getWxOrderPayment(orderNumber, galleryBaseUrl).then(res => {
      if (res) {
        this.setState({
          wxdata: res,
          isShowQrCode: true,
        });
      }
    });
  };

  getAIOrderStatus = async product_id => {
    const { orderNumber, isOrderSuccessful } = this.state;
    const { urls, history } = this.props;
    const urlParams = qs.parse(location.search.split('?')[1]);
    const { skipId } = urlParams;
    const baseUrl = urls.get('baseUrl');
    try {
      const data = await getAISubscribeOrderStatus(orderNumber, baseUrl);
      if (data == 2 && !isOrderSuccessful) {
        clearInterval(this.timer);
        this.setState({
          isOrderSuccessful: true,
        });
        history.push(
          `/software/success?orderNumber=${orderNumber}&originProduct=${product_id}&skipId=${skipId}`
        );
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  getOrderStatus = async () => {
    const { orderNumber, isOrderSuccessful } = this.state;
    const { urls, history } = this.props;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    try {
      const data = await getSubscribeOrderStatus(orderNumber, galleryBaseUrl);
      const { order_status } = data;
      if (order_status == 0 && !isOrderSuccessful) {
        clearInterval(this.timer);
        this.setState({
          isOrderSuccessful: true,
        });
        history.push(`/software/success?orderNumber=${orderNumber}`);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getPrice = () => {
    const { product_id, wxdata = {} } = this.state;
    const { amount = 0, current_price = 0 } = wxdata;
    if (product_id === saasProducts.aiphoto || product_id === saasProducts.live) {
      return amount;
    }

    return current_price;
  };

  render() {
    const {
      detailLoading,
      submitLoading,
      orderNumber,
      isTimeOut,
      wxdata = {},
      isShowQrCode,
      product_id,
    } = this.state;
    const { urls } = this.props;
    const { qrcode = '' } = wxdata;

    const amountNum = this.getPrice();
    const baseUrl = urls.get('baseUrl');
    const orderProps = {
      orderNumber,
      orderAmount: amountNum.toFixed(2),
    };

    const paymentProps = {
      baseUrl,
      code_url: qrcode,
    };

    return (
      <div className="wxpayment-container">
        {isTimeOut ? (
          <div className="timeout-review">
            <div className="title"> 支付失败 </div>
            <div className="subtitle"> 原因：二维码超时 </div>
          </div>
        ) : (
          <div className="order-review">
            <OrderDetails {...orderProps} />
            {isShowQrCode ? <PaymentDetail {...paymentProps} /> : null}
          </div>
        )}
      </div>
    );
  }
}

export default WxPayment;
