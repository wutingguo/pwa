import classNames from 'classnames';
import cls from 'classnames';
import qs from 'qs';
import React from 'react';

import XButton from '@resource/components/XButton';
import XLink from '@resource/components/XLink';

import { getCurrencyCode } from '@resource/lib/utils/currency';
import { toPage } from '@resource/lib/utils/history';
import fbqLogEvent from '@resource/lib/utils/saasfbqLogEvent';

import {
  PACKAGE_LIST_ENUM,
  packageListMap,
  packageListMapCN,
  saasProducts,
} from '@resource/lib/constants/strings';

import { checkAddGiveFree, paymentForSubscrible } from '@resource/pwa/services/payment';

import LiveStatusSection from './LiveStatusSection';

const isValidProduct = productName => {
  return (
    [
      saasProducts.gallery,
      saasProducts.slideshow,
      saasProducts.retoucher,
      saasProducts.website,
      saasProducts.live,
    ].indexOf(productName) !== -1
  );
};

const parseUrlParams = (that, nextProps) => {
  const { history, params } = nextProps || that.props;
  const { product } = params;

  if (!product || !isValidProduct(product)) {
    history.goBack();
  }

  that.setState({ productName: product }, () => that.getPageData(product));
};

const getPageData = (that, serverProductName) => {
  let productName = 'gallery';
  if (saasProducts.slideshow === serverProductName) {
    productName = 'slideshow';
  } else if (saasProducts.retoucher === serverProductName) {
    productName = 'retoucher';
  } else if (saasProducts.live === serverProductName) {
    productName = 'live';
  } else if (saasProducts.website === serverProductName) {
    productName = 'website';
  }
  const {
    default: data,
  } = require(`@resource/pwa/pages-sources/page-data/en/${productName}-status`);

  const html = that.renderHtml(data);
  that.setState({ html });
};

const createFreeOrder = (that, id) => {
  const { urls } = that.props;
  const { productName } = that.state;
  const body = {
    subscribe_orders: [{ product_id: productName, plan_id: id }],
    nonce: '',
    payment_gateway: 'BRAINTREE',
    save_card: true,
  };

  return paymentForSubscrible(body, urls.get('galleryBaseUrl'));
};

const getRedirectUrl = (that, isPwa = true) => {
  const { productName } = that.state;

  let product = 'gallery';
  if (saasProducts.slideshow === productName) {
    product = 'slideshow';
  } else if (saasProducts.retoucher === productName) {
    product = 'retoucher';
  } else if (saasProducts.website === productName) {
    if (isPwa) {
      return `/software/website/projects`;
    }
    return `cloud.zno.com/website-builder.html`;
  } else if (saasProducts.live === productName) {
    return `/software/live/photo`;
  }

  if (isPwa) {
    if (saasProducts.slideshow === productName) {
      product = 'slide-show';
    }
    return `/software/${product}/collection`;
  }

  // www官网.
  const { urls } = that.props;
  const baseUrl = urls.get('baseUrl');
  const cloudBaseUrl = urls.get('cloudBaseUrl');
  // 美国的gallery官网页为 online-photo-gallery.html
  if (product === 'gallery' && !__isCN__) {
    product = 'online-photo-gallery';
    return `${cloudBaseUrl}${product}.html`;
  }

  return `${baseUrl}${product}.html`;
};

const getStarted = async that => {
  const { productName } = that.state;
  const { boundGlobalActions, planList, history, urls, userInfo } = that.props;
  switch (productName) {
    case saasProducts.slideshow:
      window.logEvent.addPageEvent({
        name: 'SlideshowSimpleProductPage_GetStarted',
      });
      fbqLogEvent('click_Free', 'ws_slideshow', userInfo);
      break;
    case saasProducts.gallery:
      window.logEvent.addPageEvent({
        name: 'GallerySimpleProductPage_GetStarted',
      });
      window.gtag &&
        window.gtag('event', 'conversion', {
          send_to: 'AW-1002318004/06wMCJK1hI4YELTR-N0D',
          value: '1.0',
          currency: getCurrencyCode(),
        });
      fbqLogEvent('click_Free', 'ws_gallery', userInfo);
      window.rdt &&
        window.rdt('track', 'Custom', {
          customEventName: 'saas-zg-subFree',
          value: 1,
          currency: getCurrencyCode(),
        });
      break;
    case saasProducts.retoucher:
      window.logEvent.addPageEvent({
        name: 'AiPhotos_WorkspaceIntro_Click_FreeTrial',
      });
      fbqLogEvent('click_Free', 'ws-retoucher', userInfo);
      break;
    case saasProducts.website:
      window.logEvent.addPageEvent({
        name: 'AiPhotos_WorkspaceIntro_Click_FreeTrial', // wywtodo
      });
      console.log('google埋点  website --> AW-1002318004/685LCIakxJsZELTR-N0D');
      window.gtag &&
        gtag('event', 'conversion', {
          send_to: 'AW-1002318004/685LCIakxJsZELTR-N0D',
          value: '1.0',
          currency: getCurrencyCode(),
        });
      fbqLogEvent('click_Free', 'ws-website', userInfo);
      break;
    case saasProducts.live:
      window.gtag &&
        gtag('event', 'conversion', {
          send_to: 'AW-1002318004/yHCzCIuq16AZELTR-N0D',
          value: '1.0',
          currency: getCurrencyCode(),
        });
      window.fbq &&
        window.fbq('trackCustom', 'saas-zi-subFree', {
          currency: getCurrencyCode(),
          value: 1,
          action: 'click_Free',
        });
      break;
    default:
      break;
  }
  let list = planList.get(productName);
  if (list && list.size) {
    const isSubscribed = list.findIndex(el => el.get('subscribed')) !== -1;
    // 已经订阅了.
    if (isSubscribed) {
      history.push(that.getRedirectUrl());
      return;
    }

    const freePackage = list.find(el => +el.get('level_id') === PACKAGE_LIST_ENUM.free);
    if (freePackage) {
      boundGlobalActions.showGlobalLoading();

      let hasError = false;
      try {
        const res = await that.createFreeOrder(freePackage.get('id'));
        await boundGlobalActions.getProductPlanList(productName);
        await boundGlobalActions.getMySubscription();
      } catch (error) {
        hasError = true;
      }

      boundGlobalActions.hideGlobalLoading();
      window.fbq &&
        window.fbq('track', 'StartTrial', {
          value: 1,
          currency: getCurrencyCode(),
        });
      if (!hasError) {
        history.push(that.getRedirectUrl());
        return;
      }
    }
  }
  // 智能修图不是订阅逻辑，单独处理
  const userId = userInfo.get('id');
  if (saasProducts.retoucher === productName) {
    // 购买过
    if (list && list.size) {
      history.push(that.getRedirectUrl());
      return;
    }

    // 免费送
    await checkAddGiveFree(urls.get('baseUrl'));
    window.gtag &&
      window.gtag('event', 'conversion', {
        send_to: 'AW-1002318004/W0H8CJvr4csYELTR-N0D',
        value: '1.0',
        currency: getCurrencyCode(),
      });
    await boundGlobalActions.getPurchaseRecord(userId);
    history.push(that.getRedirectUrl());
    return;
  } else if (saasProducts.live === productName) {
    // 购买过
    if (list && list.size) {
      history.push(that.getRedirectUrl());
      return;
    }
    await checkAddGiveFree(urls.get('baseUrl'), { module_code: 'ALBUM_LIVE' });
    await boundGlobalActions.getPurchaseRecord(userId, 'ALBUM_LIVE');
    history.push(that.getRedirectUrl());
    return;
  }

  boundGlobalActions.addNotification({
    message: t('CODE_ERROR_MESSAGE_404000'),
    level: 'error',
    autoDismiss: 3,
  });
};

/**
 * 跳转到checkout页面.
 * @param {*} that
 */
const buyNow = that => {
  const { history } = that.props;
  const { productName } = that.state;
  const logEvnetNames = {
    [saasProducts.slideshow]: 'SlideshowSimpleProductPage_BuyNow',
    [saasProducts.gallery]: 'GallerySimpleProductPage_BuyNow',
    [saasProducts.retoucher]: 'AiPhotos_WorkspaceIntro_Click_OrderCreditPack',
    [saasProducts.website]: 'WebsiteProductPage_LearnMore', // wywtodo
  };
  const jumpLinks = {
    [saasProducts.slideshow]: '/saascheckout.html?product_id=SAAS_SLIDE_SHOW&from=saas',
    [saasProducts.gallery]: '/saascheckout.html?product_id=SAAS_GALLERY&from=saas',
    [saasProducts.retoucher]: '/saascheckout.html?product_id=SAAS_RETOUCHER&from=saas',
    [saasProducts.instant]: '/saascheckout.html?product_id=SAAS_INSTANT&from=saas',
    [saasProducts.website]:
      '/saascheckout.html?product_id=SAAS_WEBSITE&from=saas&level=30&cycle=Annually',
    [saasProducts.live]: '/saascheckout.html?product_id=SAAS_INSTANT&from=saas&plan_id=39',
  };
  window.logEvent.addPageEvent({
    name: logEvnetNames[productName],
  });

  if (__isCN__) {
    // history.push('/software/checkout-plan');
    history.push('/software/account?tabs=3');
    return;
  }
  const href = jumpLinks[productName];
  window.location.href = href;
};

const onClickHere = that => {
  const { productName } = that.state;
  let url = that.getRedirectUrl(false);
  if (saasProducts.slideshow === productName) {
    window.logEvent.addPageEvent({
      name: 'SlideshowSimpleProductPage_LearnMore',
    });
  } else if (saasProducts.gallery === productName) {
    window.logEvent.addPageEvent({
      name: 'GallerySimpleProductPage_LearnMore',
    });
  } else if (saasProducts.retoucher === productName) {
    window.logEvent.addPageEvent({
      name: 'AiPhotos_WorkspaceIntro_Click_LearnMore',
    });
  } else if (saasProducts.website === productName) {
    window.logEvent.addPageEvent({
      name: 'WebsiteProductPage_LearnMore',
    });
    location.href = `${location.protocol}//${url}`;
    return;
  } else if (saasProducts.live === productName) {
    url = '/live-photo-stream.html';
  }
  // 获取网页的路径.
  // 在浏览器上打开新页面.
  toPage(url, true);
};

const renderHtml = (that, data) => {
  const { productName } = that.state;
  const { section1, section2 } = data;
  const leareMore = that.getRedirectUrl(false);

  const isWebsite = saasProducts.website === productName; // website-status.style

  const buyBtnText =
    saasProducts.retoucher === productName ? t('ORDER_CREDIT_PACK') : t('SIGN_ME_UP', '立即购买');
  return (
    <>
      {productName !== saasProducts.live ? (
        <>
          <div className="page-section section1">
            <img className="page-icon" src={section1.image} />
            <div className="title">
              {section1.title} {section1.description ? `| ${section1.description}` : null}
            </div>
          </div>
          <div
            className="page-section section2"
            style={{ width: `${section2.elements.length ? section2.elements.length * 10 : 30}rem` }}
          >
            {section2.elements.map(item => {
              return (
                <div className={`item-${section2.elements.length}`}>
                  <img className="page-icon" src={item.image} />
                  <div className="title">{item.title}</div>
                  <div className="description" style={{ textAlign: isWebsite ? 'center' : 'left' }}>
                    {item.description}
                  </div>
                  {!!item.introList && (
                    <div className="intro-list">
                      {item.introList.map(introItem => {
                        const itemClass = classNames('intro-item', {
                          half: item.introList.length > 3,
                        });
                        return (
                          <div className={itemClass}>
                            <span>✔</span>
                            {introItem}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <LiveStatusSection />
      )}
      <div
        className={cls('page-section', {
          btns: productName !== saasProducts.live,
          live_btns: productName === saasProducts.live,
        })}
      >
        <XButton onClicked={that.getStarted}>{t('FREE_TRIAL')}</XButton>
        <XButton onClicked={that.buyNow} className="white">
          {buyBtnText}
        </XButton>
      </div>
      <div className={cls('page-section', 'more-info')}>
        {t('FOR_MORE_INFORMATION')}, &nbsp;
        <XLink
          className={cls({ live_more_link: productName === saasProducts.live })}
          onClick={that.onClickHere}
          href={leareMore}
        >
          {t('LEARN_MORE')}
        </XLink>
      </div>
    </>
  );
};

export default {
  isValidProduct,
  parseUrlParams,
  getPageData,
  createFreeOrder,
  getRedirectUrl,
  getStarted,
  buyNow,
  onClickHere,
  renderHtml,
};
