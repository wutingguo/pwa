import { paymentForSubscrible } from '@resource/pwa/services/payment';
import { saasProducts, packageListMap, packageListMapCN } from '@resource/lib/constants/strings';

/**
 * 从支付渠道跳转到改页面后, 点击对应的产品的逻辑.
 */
const paymentClick = (that, product) => {
  const { history, urls } = that.props;
  const isWWW = window.location.origin.indexOf('www') !== -1;
  let logName = '';
  let href = '';

  switch (product) {
    case 'gallery': {
      logName = 'SubSuccess_Click_Gallery';
      href = __isCN__ ? '/software/gallery/collection' : '/software/gallery/collection';
      break;
    }
    case 'slide-show': {
      logName = 'SubSuccess_Click_Slideshow';
      href = '/software/slide-show/collection';
      break;
    }
    case 'selection': {
      logName = '';
      href = '/software/selection/collect';
      break;
    }
    case 'aiphoto': {
      logName = '';
      href = '/software/aiphoto/collection';
      break;
    }
    case 'live': {
      logName = '';
      href = '/software/live/photo';
      break;
    }
    default: {
      logName = 'SubSuccess_Click_Designer';
      href = '/software/designer/projects';
      break;
    }
  }

  window.logEvent.addPageEvent({
    name: logName
  });
  if (isWWW) {
    const saasOrigin = urls.get('saasBaseUrl').substr(0, urls.get('saasBaseUrl').lastIndexOf('/'));
    window.open(`${saasOrigin}${href}`, '__blank');
  } else {
    history.push(href);
  }
};

const createFreeOrder = ({ urls, productName, plan_id }) => {
  const body = {
    subscribe_orders: [{ product_id: productName, plan_id }],
    nonce: '',
    payment_gateway: 'BRAINTREE',
    save_card: true
  };

  return paymentForSubscrible(body, urls.get('galleryBaseUrl'));
};

const getRedirectUrl = productName => {
  if (productName === saasProducts.designer) {
    return `/software/projects`;
  }

  let product = 'gallery';
  if (saasProducts.slideshow === productName) {
    product = 'slide-show';
  }

  return `/software/${product}/collection`;
};

/**
 * 从注册入口跳转到当前页面, 点击对应的产品的逻辑.
 */
const registeredClick = async (that, product) => {
  const { planList, urls, boundGlobalActions, history } = that.props;
  let productName = saasProducts.gallery;
  let logName = 'RegSuccess_Click_Gallery';
  const isWWW = window.location.origin.indexOf('www') !== -1;
  if (product === 'slide-show') {
    productName = saasProducts.slideshow;
    logName = 'RegSuccess_Click_Slideshow';
  } else if (product === 'designer') {
    productName = saasProducts.designer;
    logName = 'RegSuccess_Click_Designer';
  }

  window.logEvent.addPageEvent({
    name: logName
  });

  const list = planList.get(productName);

  if (list && list.size) {
    const isSubscribed = list.findIndex(el => el.get('subscribed')) !== -1;

    // 已经订阅了.
    if (isSubscribed) {
      if (isWWW) {
        const saasOrigin = urls
          .get('saasBaseUrl')
          .substr(0, urls.get('saasBaseUrl').lastIndexOf('/'));
        const redirectUrl = getRedirectUrl(productName);
        window.open(`${saasOrigin}${redirectUrl}`, '__blank');
        return;
      }
      history.push(getRedirectUrl(productName));

      if (!__DEVELOPMENT__) {
        location.reload();
      }
      return;
    }

    const packageListEnum = __isCN__ ? packageListMapCN : packageListMap;

    const freePackage = list.find(el => el.get('level_name') === packageListEnum.free);
    if (freePackage) {
      boundGlobalActions.showGlobalLoading();

      let hasError = false;
      try {
        const res = await createFreeOrder({
          urls,
          productName,
          plan_id: freePackage.get('id')
        });

        await boundGlobalActions.getMySubscription();
        await boundGlobalActions.getProductPlanList(productName);
      } catch (error) {
        hasError = true;
      }

      boundGlobalActions.hideGlobalLoading();

      if (!hasError) {
        if (isWWW) {
          const saasOrigin = urls
            .get('saasBaseUrl')
            .substr(0, urls.get('saasBaseUrl').lastIndexOf('/'));
          const redirectUrl = getRedirectUrl(productName);
          window.open(`${saasOrigin}${redirectUrl}`, '__blank');
        } else {
          history.push(getRedirectUrl(productName));
          if (!__DEVELOPMENT__) {
            location.reload();
          }
        }
      }
    }
  }
};

const onProductClick = (that, product) => {
  const { registered } = that.state;

  if (registered) {
    return registeredClick(that, product);
  }

  paymentClick(that, product);
};

export default {
  onProductClick
};
