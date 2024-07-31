import { assign, get, isBoolean, isNull } from 'lodash';

// import qs from 'qs';
import * as cache from '@resource/lib/utils/cache';
import { getCountryCode } from '@resource/lib/utils/currency';
import { navigateToWwwOrSoftware } from '@resource/lib/utils/history';
import { relativeUrl } from '@resource/lib/utils/language';

import paypalUtil from '@apps/gallery-client-mobile/utils/payPal';
import {
  createOrder,
  getAutomatic,
  getCheckoutDetail,
  getCurrentCart,
  preparePayment,
  saveAddress,
  saveShipMethod,
} from '@apps/gallery-client/services/cart';
import { getStoreById } from '@apps/gallery-client/services/store';
import {
  getEmailCacheKey,
  getGuestUidCacheKey,
  getPhoneCacheKey,
} from '@apps/gallery-client/utils/helper';

import {
  showOfflinePaymentModal,
  showPaymentFailedAlertModal,
  showShopCartIsEmptyModal,
} from './modal';

// 当选择美国或加拿大时 需要用户再选子地区 并将税置空
const onSelectUsOrCa = that => {
  const { price } = that.state;
  that.setState({
    // paymentButtonDisabled: true,
    price: { ...price, tax: '0.00' },
  });
};

const getCurrentCartData = async (that, changeAddress, saveMethodFromApi) => {
  const { store, history, urls } = that.props;
  const { methods } = that.state;
  const baseUrl = urls.get('estoreBaseUrl');
  that.setState({
    isLoadingData: true,
  });
  let curMethodExit = true;
  try {
    const rackId = store.get('rackId');
    const data = await getCurrentCart({ rackId, baseUrl });
    const {
      shipping: { address, method = {} },
      currency,
      price,
      cart_items,
    } = data;
    // 在没有价格时 或者购物车内没有内容 为没有数据 或 已经付过款
    if (!price || !cart_items?.length) {
      history.replace('/printStore/shopping-cart');
      return;
    }

    let isThirdOrder = false;
    let defaultMethodCode = 'FES';
    let supplierIdArr = [];
    if (cart_items && cart_items.length) {
      isThirdOrder = __isCN__
        ? cart_items.some(item => item.supplier_code !== 'ZNO')
        : cart_items.every(item => item.supplier_code !== 'ZNO');
      cart_items.forEach(i => {
        supplierIdArr.push(i.supplier_id);
      });
    }
    if (isThirdOrder) {
      defaultMethodCode = methods && methods.length ? methods[0].code : '';
    }
    curMethodExit =
      methods && methods.length && methods.find(item => item.code === method.method_code);
    if ((!method?.method_code || !curMethodExit) && !saveMethodFromApi) {
      // 与中台协商后 如果默认的shipping method为空 或者不存在已有列表中 则保存一次

      saveShipMethod(
        {
          id: null,
          supplier_id: [...new Set(supplierIdArr)],
          rack_id: +rackId,
          ship_method: defaultMethodCode,
        },
        baseUrl
      ).then(() => {
        getCurrentCartData(that, false, true);
      });
      return;
    }

    that.setState(
      {
        dropServiceData: {
          ...data,
        },
        address: address || {},
        current_method_id: method?.method_code || defaultMethodCode,
        cartMethod: method,
        currency,
        price,
        cart_items,
        isThirdOrder,
        isLoadingData: false,
      },
      () => {
        const { current_method_id, price, cart_items } = that.state;
        const isPureDigital = cart_items.every(item => {
          return item.item_details.every(subItem => !!subItem.main_sku.digital_other_info);
        });
        console.log('isPureDigital: ', isPureDigital);
        // 总金额为0
        const isTotalMoneyIsZero = Number(price?.payable_amount) === 0;
        const hasSelectMethod =
          methods && methods.length && methods.find(item => item.code === current_method_id);
        console.log('hasSelectMethod: ', hasSelectMethod);
        that.setState({
          paymentButtonDisabled: !hasSelectMethod || isTotalMoneyIsZero,
          stripeButtonDisabled: !hasSelectMethod || isTotalMoneyIsZero,
          hasSelectMethod,
          isTotalMoneyIsZero,
        });
        if (isPureDigital) {
          that.setState({
            noShipMethodCosts: false,
            checkoutDisabled: false,
            paymentButtonDisabled: false,
            stripeButtonDisabled: false,
          });
        }
      }
    );

    // 回显表单
    if (!changeAddress) {
      that.newAddressForm.fillForm(address);
    }
  } catch (e) {
    console.error(e);
  }
};

const getAutomaticData = async that => {
  const { urls } = that.props;
  const baseUrl = urls.get('estoreBaseUrl');
  const res = await getAutomatic({ baseUrl });
  const formatCost = data => ({
    code: data.method_code,
    id: data.shipping_level_id,
    shipping_cost: data.amount,
    name: data.method_name,
  });
  const { ship_method_costs = [] } = res || {};
  if (ship_method_costs === null || !ship_method_costs.length) {
    that.setState({
      noShipMethodCosts: true,
      checkoutDisabled: true,
      paymentButtonDisabled: true,
      stripeButtonDisabled: true,
      methods: [],
    });
    return;
  }

  that.setState({
    methods: ship_method_costs.map(item => formatCost(item)),
    noShipMethodCosts: false,
    checkoutDisabled: false,
  });

  // const [standard_cost, priority_cost] = ship_method_costs;
  // console.log('res:********* ', res);

  // that.setState({
  //   methods: [formatCost(standard_cost), formatCost(priority_cost)]
  // });
};

const initPaymentClient = async that => {
  const { history, boundGlobalActions, urls, store } = that.props;
  const { hasSelectMethod, price } = that.state;

  const estoreBaseUrl = urls.get('estoreBaseUrl');
  const storeId = store.get('id');

  // 禁用支付相关的按钮 直到确认条件均满足
  that.setState({
    paymentButtonDisabled: true,
    stripeButtonDisabled: true,
  });
  // 获取b端商店的支付信息
  const storeInfo = await getStoreById({ baseUrl: estoreBaseUrl, storeId });
  if (!storeInfo) return;
  const { payment_methods = [] } = storeInfo;
  const isPaypalAlreadySetup = payment_methods.some(m => m.payment_method === 'PAYPAL');
  const isStripeAlreadySetup = payment_methods.some(m => m.payment_method === 'STRIPE');
  const isOfflineAlreadySetup = payment_methods.some(m => m.payment_method === 'OFFLINE');
  that.setState({
    isPaypalAlreadySetup,
    isOfflineAlreadySetup,
    isStripeAlreadySetup,
  });

  // 既没有设置paypal也没有设线下支付
  if (!isPaypalAlreadySetup && !isOfflineAlreadySetup && !isStripeAlreadySetup) {
    // b端未设置支付方式 切换为checkout disabled状态
    that.setState({
      checkoutDisabled: true,
    });
  } else {
    const isTotalMoneyIsZero = Number(price?.payable_amount) === 0;
    that.setState({
      checkoutDisabled: false,
      paymentButtonDisabled: !hasSelectMethod || isTotalMoneyIsZero,
      stripeButtonDisabled: !hasSelectMethod || isTotalMoneyIsZero,
    });
  }

  // paypal
  if (isPaypalAlreadySetup) {
    // 监听paypal窗口消息
    paypalUtil.onMessage({
      listener: data => {
        const { success, status } = data || {};
        if (success) {
          history.replace('/printStore/order-success');
          return;
        }
        showPaymentFailedAlertModal({ boundGlobalActions, history });
      },
    });
  }
};

const init = async that => {
  that.setState({
    isLoadingData: true,
  });
  await getAutomaticData(that);
  await getCurrentCartData(that);

  initPaymentClient(that);
  // const {current_method_id,methods} = that.state
  // if(!current_method_id && methods && methods.length){
  //   that.setState({
  //     current_method_id : methods[0].code

  //   })
  // }
  that.setState({
    isLoadingData: false,
  });
};

const didMount = that => {
  init(that);
};

const getCheckoutDetailData = that => {
  return new Promise((resolve, reject) => {
    getCheckoutDetail()
      .then(data => {
        const { shipping = {}, cart_info = {}, payable_amount = '', tax = '' } = data;
        const {
          address = {},
          methods = [],
          current_method_id = '',
          fee = '',
          holiday_message = '',
          is_in_holiday = '',
        } = shipping;
        const { currency = {}, price = {}, cart_items = [] } = cart_info;

        if (!cart_items || cart_items.length === 0) {
          const redirectPath = relativeUrl('/shopping-cart.html');
          navigateToWwwOrSoftware(redirectPath, false);

          return;
        }

        that.setState(
          {
            isLoadingData: false,
            address,
            methods,
            currency,
            price,
            cart_items,
            current_method_id,
            payable_amount,
            tax,
            fee,
            holiday_message,
            is_in_holiday,
          },
          () => resolve()
        );
      })
      .catch(err => {
        console.log('Connect failed!', err);
        that.setState({
          isDataLoaded: false,
        });
        reject();
      });
  });
};

const refreshPageData = (that, newData, isDropShip) => {
  console.log('newData', newData);
  const { dropServiceData } = that.state;
  if (isBoolean(isDropShip)) {
    that.setState({
      dropServiceData: assign(dropServiceData, { added: isDropShip }),
    });
  }
  const { shipping = {}, cart_info = {}, payable_amount = '', tax = '', cart_items } = newData;
  const {
    address = {},
    method,
    methods = [],
    current_method_id = '',
    fee = '',
    holiday_message = '',
    is_in_holiday = '',
  } = shipping;
  const { currency = {}, price = {} } = cart_info;

  that.setState({
    isLoadingData: false,
    isButton1Loading: false,
    isButton2Loading: false,
    address,
    methods,
    cartMethod: method,
    currency,
    price,
    cart_items,
    current_method_id,
    payable_amount,
    tax,
    fee,
    holiday_message,
    is_in_holiday,
  });
};

const getLayoutProps = that => {
  const data = that.props.pathContext;
  const { header, metaData, i18n, needLogin } = data;
  return {
    header: {
      ...header,
      setProPlanInfo: that.setProPlanInfoHandle,
    },
    metaData,
    className: 'order-confirm-page',
    i18n,
    needLogin,
    isHideFooter: true,
  };
};

const getShippingAddressProps = that => {
  const { address, currency } = that.state;
  return {
    address,
    currency,
    newAddressFormRef: el => (that.newAddressForm = el),
    saveAddressData: that.saveAddressData,
    getAutomaticData: that.getAutomaticData,
    getCurrentCartData: that.getCurrentCartData,
    onSelectUsOrCa: that.onSelectUsOrCa,
  };
};

const onDisabledBtn = that => {
  that.setState({
    isButton1Loading: true,
    isButton2Loading: true,
  });
};

const getShippingMethodProps = that => {
  const { store } = that.props;
  const {
    cartMethod,
    methods,
    currency,
    current_method_id,
    holiday_message,
    is_in_holiday,
    dropServiceData,
    isShowGuideSubscribeProplan,
    isThirdOrder,
  } = that.state;
  const countryCode = getCountryCode();
  const rackId = store.get('rackId');
  return {
    cartMethod,
    methods,
    isThirdOrder,
    currency,
    countryCode,
    current_method_id,
    dropServiceData,
    holiday_message,
    is_in_holiday,
    rack_id: rackId,
    isShowGuideSubscribeProplan,
    onDisabledBtn: () => onDisabledBtn(that),
    getCurrentCartData: (changeAddress, saveMethodFromApi) =>
      getCurrentCartData(that, changeAddress, saveMethodFromApi),
    onSubscribeProPlanSuccess: that.onSubscribeProPlanSuccess,
    refreshPageData: (newData, isDropShip) => refreshPageData(that, newData, isDropShip),
  };
};

const getShippingItemListProps = that => {
  const { currency, price, cart_items } = that.state;
  const countryCode = getCountryCode();
  return {
    currency,
    countryCode,
    price,
    cart_items: cart_items || [],
  };
};

const getShoppingCartPriceProps = that => {
  const { price, currency, payable_amount, tax, fee } = that.state;
  const countryCode = getCountryCode();
  return {
    price,
    currency,
    countryCode,
    isCheckout: true,
    additionalData: {
      payable_amount,
      tax,
      fee,
    },
    refreshPageData: (newData, isDropShip) => refreshPageData(that, newData, isDropShip),
  };
};

const checkNewAddress = (that, isPaypal) => {
  const { address } = that.state;
  const { id } = address;

  return new Promise((resolve, reject) => {
    if (!!id) {
      resolve();
    } else {
      const checkResult = that.newAddressForm.checkAllItemValue();
      if (!checkResult) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        return reject();
      }
      const buttonIndex = isPaypal ? 2 : 1;
      that.setState({ [`isButton${buttonIndex}Loading`]: true });
      that.newAddressForm
        .submitAddress()
        .then(() => that.getCheckoutDetailData())
        .then(() => resolve())
        .catch(e => {
          that.setState({ [`isButton${buttonIndex}Loading`]: false });
        });
    }
  });
};

const handleAlertClose = that => {
  that.setState({
    showAlert: false,
  });
};

const getAlerModalProps = that => {
  return {
    html: t('CHECKOUT_PAYPAL_DECLINED_TIP'),
    btnText: 'Ok',
    actions: {
      handleClose: () => handleAlertClose(that),
      handleOk: () => handleAlertClose(that),
    },
  };
};

const saveAddressData = async that => {
  const { qs, urls } = that.props;
  const { address: addressInState } = that.state;
  const addressId = addressInState?.id || null;
  const collection_uid = qs.get('collection_uid');
  const baseUrl = urls.get('estoreBaseUrl');

  const data = await that.newAddressForm.submitAddress();

  const { address, a_type } = data || {};

  if (!address) {
    return false;
  }

  const cacheEmailKey = getEmailCacheKey(collection_uid);
  const email = cache.get(cacheEmailKey);

  const {
    cert_id,
    city,
    country,
    document,
    // email,
    full_name,
    phone_number,
    street1,
    street2,
    sub_city,
    sub_country,
    zip_or_postal_code,
    town,
    province_code,
  } = address;
  // debugger

  const res = await saveAddress(
    {
      id: addressId,
      country_code: country,
      province: sub_country,
      city,
      district: sub_city,
      zip_code: zip_or_postal_code,
      address: street1,
      address2: street2,
      receiver_name: full_name,
      receiver_phone: phone_number,
      receiver_email: email,
      street: town,
      document,
      cert_id,
      province_code,
    },
    baseUrl
  );
  console.log('res:------saveAddress ', res);
  return true;
};

const setProPlanInfoHandle = (that, params) => {
  const { isShowGuideSubscribeProplan } = params;
  that.setState({
    // 显示引导订阅
    isShowGuideSubscribeProplan,
  });
};
const onSubscribeProPlanSuccess = that => {
  that.setState({
    isShowGuideSubscribeProplan: false,
  });
};

// 创建订单 由中台支付流程做 前端不需要调用
const handleCreateOrder = (that, paramters = {}) => {
  const { urls } = that.props;
  const baseUrl = urls.get('estoreBaseUrl');
  const params = Object.assign({}, paramters, {
    // widget_id: widgetIdEnum.CREATE_ORDER,
    biz_param: {},
    payment_param: {},
    operation_param: {
      widget_id: 'CREATE_ORDER',
    },
  });

  that.setState({
    isLoadingData: true,
  });
  createOrder(params, baseUrl)
    .then(data => {
      const { order_number } = data;
      window.location.hash = `/printStore/order-success`;
    })
    .catch(err => {
      that.setState({
        // isLoadingData: false,
        isButton1Loading: false,
        isButton2Loading: false,
      });
      // 支付失败刷新页面
      // that.getCheckoutDetailData();
    });
};

// 判断购物车并获取付款信息
const checkShopCartAndGetPaymentInfo = async (that, channel) => {
  const { history, boundGlobalActions, urls, store } = that.props;
  const baseUrl = urls.get('estoreBaseUrl');

  try {
    const result = await preparePayment({ channel, baseUrl });

    // 如果购物车为空 弹出窗口提示可能已经支付完成
    if (result.isShopCartEmpty) {
      showShopCartIsEmptyModal({ boundGlobalActions, history });
      return false;
    }
    if (channel === 'PAYPAL') {
      const info = result.data;
      const { request_data } = info || {};
      // 无法获取到支付数据 为异常情况 通常购物车不为空都能拿到数据 包括线下支付
      if (!request_data) {
        const e = new Error('no payment request_data');
        console.error(e);
        return false;
      }
      // 返回支付信息
      return request_data;
    }
    // 其他channel返回true
    return true;
  } catch (e) {
    return null;
  }
};

// 检查并保存地址
const checkAndSaveAddressForm = async that => {
  const checkResult = that.newAddressForm.checkAllItemValue();
  if (!checkResult) {
    document.getElementById('order-confirm-content').scrollIntoView();
    return false;
  }
  const saveSuccess = await saveAddressData(that);
  return saveSuccess;
};

const toOrderWithPaypal = async that => {
  that.setState({
    openPaymentWindowFailed: false,
  });
  window.logEvent.addPageEvent({
    name: 'ClientEstore_Shipping_Click_OrderWithPayPal',
  });

  // loading此函数完成
  that.setState({
    paypalButtonLoading: true,
  });
  const saveSuccess = await checkAndSaveAddressForm(that);
  if (!saveSuccess) {
    that.setState({
      paypalButtonLoading: false,
    });
    return;
  }

  // 校验购物车 并 拿取支付信息
  const token = await checkShopCartAndGetPaymentInfo(that, 'PAYPAL');
  switch (typeof token) {
    case 'string': {
      paypalUtil.openPayPalWindow({ token });
      break;
    }
    case 'boolean': {
      // 接口错误
      that.setState({
        openPaymentWindowFailed: true,
      });
      break;
    }
    default: {
      if (isNull(token)) {
        // 其他错误
        that.setState({
          openPaymentWindowFailed: true,
        });
      }
      break;
    }
  }

  that.setState({
    paypalButtonLoading: false,
  });
};

const toOrderPage = async that => {
  const { history } = that.props;
  that.setState({ stripeButtonLoading: true });
  const saveSuccess = await checkAndSaveAddressForm(that);
  if (!saveSuccess) {
    that.setState({ stripeButtonLoading: false });
    return;
  }
  history.push('/printStore/shopping-cart/shipping/billing');
};

const toOrderWithOffline = async that => {
  const { history, boundGlobalActions } = that.props;
  window.logEvent.addPageEvent({
    name: 'ClientEstore_Shipping_Click_OrderWithOfflinePayment',
  });

  that.setState({ offlineButtonLoading: true });
  const saveSuccess = await checkAndSaveAddressForm(that);
  if (!saveSuccess) {
    that.setState({ offlineButtonLoading: false });
    return;
  }
  showOfflinePaymentModal({
    history,
    boundGlobalActions,
    orderWithOfflinePayment: async () => {
      const token = await checkShopCartAndGetPaymentInfo(that, 'OFFLINE');
      switch (typeof token) {
        case 'boolean': {
          token && history.replace('/printStore/order-success');
          break;
        }
        default: {
          break;
        }
      }
    },
  });
  that.setState({ offlineButtonLoading: false });
};

const checkAddressPriceAndOrder = (that, isPaypal) => {
  const { payable_amount, currency, paypalInstance, address } = that.state;
  console.log('paypalInstance: ', paypalInstance);
  if (isPaypal) {
    // paypal 实例调用
    paypalInstance.tokenize(
      {
        flow: 'checkout',
        amount: payable_amount,
        currency: currency.code,
      },
      (tokenizeErr, payload) => {
        if (tokenizeErr) {
          if (tokenizeErr.type !== 'CUSTOMER') {
            console.error('Error tokenizing:', tokenizeErr);
            return;
          }
          switch (tokenizeErr.code) {
            case 'PAYPAL_POPUP_CLOSED':
              that.setState({
                isButton1Loading: false,
                isButton2Loading: false,
              });
              return;
            case 'PAYPAL_ACCOUNT_TOKENIZATION_FAILED':
              that.setState({
                isButton1Loading: false,
                isButton2Loading: false,
                showAlert: true,
              });
              console.error('PayPal tokenization failed. See details:', tokenizeErr.details);
              return;
            case 'PAYPAL_FLOW_FAILED':
              that.setState({
                isButton1Loading: false,
                isButton2Loading: false,
                showAlert: true,
              });
              console.error(
                'Unable to initialize PayPal flow. Are your options correct?',
                tokenizeErr.details
              );
              return;
            default:
              that.setState({
                isButton1Loading: false,
                isButton2Loading: false,
                showAlert: true,
              });
              console.error('Error!', tokenizeErr);
              return;
          }
        }
        console.log(payload.nonce);
        // 获取 nonce
        handleCreateOrder(that, {
          nonce: payload.nonce,
        });
      }
    );
  } else {
    // 跳转billing-review
    const redirectPath = relativeUrl('/billing-review.html');
    navigateToWwwOrSoftware(redirectPath, false);
  }
  // } else {
  //   handleCreateOrder(that);
  // }
};

export default {
  didMount,
  checkNewAddress,
  getLayoutProps,
  getShippingMethodProps,
  getShippingAddressProps,
  getShippingItemListProps,
  getShoppingCartPriceProps,
  getAlerModalProps,
  getCheckoutDetailData,
  setProPlanInfoHandle,
  onSubscribeProPlanSuccess,
  getAutomaticData,
  getCurrentCartData,
  toOrderWithPaypal,
  toOrderWithOffline,
  saveAddressData,
  toOrderPage,
  onSelectUsOrCa,
};
