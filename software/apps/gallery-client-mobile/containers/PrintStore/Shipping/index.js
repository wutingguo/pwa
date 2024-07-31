import { orderBy } from 'lodash';
import React, { Component, memo, useCallback } from 'react';

// import XButton from 'appsCommon/components/dom/XButton';
// import Layout from 'src/components/common/Layout';
import XLoading from '@resource/components/XLoading';

// import Breadcrumb from 'src/components/common/Breadcrumb';
import { getCurrencyCode } from '@resource/lib/utils/currency';

import AlertModal from '@src/components/AlertModal';

import ShippingAddress from './ShippingAddress';
import ShippingItemList from './ShippingItemList';
import ShippingMethod from './ShippingMethod';
import ShippingPayment from './ShippingPayment';
import ShoppingCartPriceSection from './ShoppingCartPriceSection';
import main from './_handleHelp';

import './index.scss';

// 选择一个警告信息显示 order数值高的优先
const pickAlertMessage = (messages = []) => {
  if (!messages?.length) return '';
  const showMessage = orderBy(
    messages.filter(m => m.condition),
    ['order'],
    ['desc']
  )[0];
  return showMessage?.message || '';
};

// paypal 暂不支持以下货币支付
const paypalUnSupportCurrencyMap = ['KRW', 'SAR', 'IDR', 'TRY', 'AED', 'QAR'];

export default class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingData: false,
      address: {},
      methods: [],
      currency: {},
      price: {},
      cart_items: [],
      current_method_id: '',
      payable_amount: '',
      tax: '',
      fee: '',
      dropServiceData: {},
      holiday_message: '',
      is_in_holiday: '',
      paypalInstance: '', // paypal 实例
      nonce: '',
      paypalButtonLoading: false,
      stripeButtonLoading: false,
      offlineButtonLoading: false,
      paymentButtonDisabled: false,
      stripeButtonDisabled: false,
      // b端是否设置好了paypal
      isPaypalAlreadySetup: true,
      // b端是否设置好了stripe
      isStripeAlreadySetup: false,
      // b端是否设置了offline线下支付
      isOfflineAlreadySetup: true,
      // 禁用 order按钮
      checkoutDisabled: false,
      // 打开paypal窗口失败
      openPaymentWindowFailed: false,
      // b端未设置self运费
      noShipMethodCosts: false,
      isButton2Loading: true,
      showAlert: false,
      isShowGuideSubscribeProplan: false,
      isTotalMoneyIsZero: false,
    };
  }

  componentDidMount() {
    this.didMount();
  }

  didMount = () => main.didMount(this);
  getLayoutProps = () => main.getLayoutProps(this);
  checkNewAddress = isPaypal => main.checkNewAddress(this, isPaypal);
  getCheckoutDetailData = () => main.getCheckoutDetailData(this);
  getShippingAddressProps = () => main.getShippingAddressProps(this);
  getShippingMethodProps = () => main.getShippingMethodProps(this);
  getShippingItemListProps = () => main.getShippingItemListProps(this);
  getShoppingCartPriceProps = () => main.getShoppingCartPriceProps(this);
  getAlerModalProps = () => main.getAlerModalProps(this);
  toOrderWithPaypal = async isPureDigital => await main.toOrderWithPaypal(this, isPureDigital);
  toOrderWithOffline = async isPureDigital => await main.toOrderWithOffline(this, isPureDigital);
  toOrderPage = () => main.toOrderPage(this);
  saveAddressData = () => main.saveAddressData(this);
  getCurrentCartData = changeAddress => main.getCurrentCartData(this, changeAddress);
  getAutomaticData = () => main.getAutomaticData(this);
  setProPlanInfoHandle = params => main.setProPlanInfoHandle(this, params);
  onSubscribeProPlanSuccess = () => main.onSubscribeProPlanSuccess(this);
  onSelectUsOrCa = () => main.onSelectUsOrCa(this);
  render() {
    const {
      isLoadingData,
      paypalButtonLoading,
      offlineButtonLoading,
      paymentButtonDisabled,
      stripeButtonDisabled,
      checkoutDisabled,
      openPaymentWindowFailed,
      isPaypalAlreadySetup,
      isOfflineAlreadySetup,
      isStripeAlreadySetup,
      noShipMethodCosts,
      isButton2Loading,
      showAlert,
      payable_amount,
      price,
      isTotalMoneyIsZero,
      cart_items,
      currency,
    } = this.state;

    const { boundGlobalActions, boundProjectActions, urls } = this.props;
    const estoreBaseUrl = urls.get('estoreBaseUrl');

    const isPaypalUnSupport = paypalUnSupportCurrencyMap.includes(getCurrencyCode());

    let isPureDigital = false;
    if (cart_items.length) {
      isPureDigital = cart_items.every(item => {
        return item.item_details.every(subItem => !!subItem.main_sku.digital_other_info);
      });
    }

    // 选择警告消息
    let alertMessage = pickAlertMessage([
      {
        condition: isTotalMoneyIsZero,
        order: 0,
        message: t('WARNING_TIPS2', `*Total amount that is 0.00 isn't allowed.`),
      },
      {
        condition: openPaymentWindowFailed,
        order: 1,
        message: `*The system failed to open the payment window. Please try again.`,
      },
      {
        condition: noShipMethodCosts,
        order: 2,
        message: t('SHIPPING_TIPS'),
      },
      {
        condition: !isPaypalAlreadySetup && !isOfflineAlreadySetup && !isStripeAlreadySetup,
        order: 3,
        message: t(
          'WARNING_TIPS1',
          `*The payment hasn't been setup. Please contact the photographer.`
        ),
      },
    ]);

    return (
      !!estoreBaseUrl && (
        <div className="order-confirm-page" style={{ height: window.innerHeight - 450 }}>
          <div className="order-confirm-content" id="order-confirm-content">
            <ShippingAddress {...this.getShippingAddressProps()} estoreBaseUrl={estoreBaseUrl} />
            <ShippingMethod
              {...this.getShippingMethodProps()}
              estoreBaseUrl={estoreBaseUrl}
              isPureDigital={isPureDigital}
            />
            <ShippingItemList {...this.getShippingItemListProps()} isPureDigital={isPureDigital} />
            <ShoppingCartPriceSection {...this.getShoppingCartPriceProps()} />
          </div>
          <ShippingPayment
            {...{
              alertMessage,
              paypalButtonLoading,
              offlineButtonLoading,
              checkoutDisabled,
              stripeButtonDisabled: isPureDigital ? false : stripeButtonDisabled,
              paymentButtonDisabled: isPureDigital ? false : paymentButtonDisabled,
              boundGlobalActions,
              boundProjectActions,
              isPaypalAlreadySetup,
              isStripeAlreadySetup,
              isOfflineAlreadySetup,
              estoreBaseUrl,
              currency,
              price,
              toOrderWithPaypal: () => this.toOrderWithPaypal(isPureDigital),
              toOrderWithOffline: () => this.toOrderWithOffline(isPureDigital),
              toOrderPage: () => this.toOrderPage(isPureDigital),
            }}
          />

          <XLoading isShown={isLoadingData} backgroundColor="rgba(255,255,255,0.6)" />

          {showAlert ? <AlertModal {...this.getAlerModalProps()} /> : null}
        </div>
      )
    );
  }
}
