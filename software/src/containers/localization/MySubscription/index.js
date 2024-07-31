import classNames from 'classnames';
import { fromJS } from 'immutable';
import React, { Fragment } from 'react';

import XButton from '@resource/components/XButton';
import XPureComponent from '@resource/components/XPureComponent';

import XStorageInfo from '@resource/components/pwa/XStorageInfo';

import { formatDate } from '@resource/lib/utils/dateFormat';
import { format } from '@resource/lib/utils/timeFormat';
import { getQs } from '@resource/lib/utils/url';

import * as modalTypes from '@resource/lib/constants/modalTypes';
import {
  aiphotoDelicacyInfo,
  aiphotoInfoFields,
  aiphotoMTComboCodes,
} from '@resource/lib/constants/priceInfo';
import { aiphotoInfo, livePhotoInfo, saasProducts } from '@resource/lib/constants/strings';

import { getAISubscribeLIST, getCustomerDeliveryList } from '@resource/pwa/services/subscription';

import aiphotoPNG from '@resource/static/icons/aiphoto.png';
// import selectionIcon from '@common/icons/slideshow_icon.png';
// import designerIcon from '@common/icons/designer_icon.png';
// import aiphotoIcon from '@common/icons/zno-aiphoto-black.png';
import designerPNG from '@resource/static/icons/designer.png';
import galleryPNG from '@resource/static/icons/gallery.png';
import livePNG from '@resource/static/icons/live.png';
import selectionPNG from '@resource/static/icons/selection.png';
// import galleryIcon from '@common/icons/gallery_icon.png';
import slideshowIcon from '@resource/static/icons/slideshow_HD.png';

import noDataSrc from './images/no-data.png';
import OrderComp from './order';

import './index.scss';

const formKeys_0 = [
  'product_name',
  'plan_name',
  'expire_time',
  'details',
  'price',
  // 'productRigths',
  'manage',
];

const formKeys_1 = ['product_name', 'plan_name', 'order_time', 'details', 'price', 'manage'];

const formKeys = curTab => (curTab === 0 ? formKeys_0 : formKeys_1);

const formKeyLabels = {
  plan_name: 'PLAN',
  details: 'DETAILS',
  product_name: 'PRODUCT',
  price: 'COST',
  // productRigths: 'PRODUCT_RIGHTS',
  expire_time: 'SAAS_EXPIRE_TIME',
  manage: 'MANAGE',
  order_time: 'SAAS_ORDER_TIME',
};

const tabList = [
  { label: '可使用的优惠券', tab: 0 },
  { label: '已失效的优惠券', tab: 1 },
];

export default class MySubscription extends XPureComponent {
  state = {
    mySubscription: null,
    curCheckout: 0,
    AICombo: [],
    urls: null,
    checkoutTexts: ['当前订阅', '已购套餐'],
    isShowMyCoupon: false,
    isShowOrder: false,
    currentTab: 0,
    couponList: [],
  };

  onUpgrade = (product_id, product_name, comboCode, { level_id = 20 } = {}) => {
    const { boundGlobalActions, urls } = this.props;
    const saasBaseUrl = urls && urls.get('saasBaseUrl');
    window.logEvent.addPageEvent({
      name: 'MySubscription_Click_Upgrade',
      page_name: 'my-subscription',
    });
    let curInfo = {},
      combos = null;

    if (product_id === saasProducts.aiphoto) {
      curInfo = aiphotoInfo[1];
      // // 跳过智能修图的体验套餐
      if (comboCode === 'ALBUM_EDIT_IMAGE_ONE') {
        curInfo = aiphotoInfoFields.find(item => item.comboCode === comboCode) || {};
        combos = aiphotoInfoFields;
      } else if (aiphotoMTComboCodes.indexOf(comboCode) !== -1) {
        curInfo = aiphotoDelicacyInfo.find(item => item.comboCode === comboCode) || {};
        curInfo.subTab = 1;
        combos = aiphotoDelicacyInfo;
      } else if (comboCode === 'MEITU_EDIT_IMAGE_TIYAN') {
        // 精修体验套餐跳转精修
        curInfo = aiphotoDelicacyInfo[0];
        curInfo.subTab = 1;
        combos = aiphotoDelicacyInfo;
      } else if (comboCode !== 'EDIT_IMAGE_TIYAN') {
        curInfo = aiphotoInfo.find(item => item.comboCode === comboCode) || {};
      }
      console.log({ curInfo });
    } else if (product_id === saasProducts.live) {
      curInfo = livePhotoInfo[1];
      if (comboCode !== 'ALBUM_LIVE_FREE') {
        curInfo = livePhotoInfo.find(item => item.comboCode === comboCode) || {};
      }
    }

    // console.log('curInfo:///////// ', curInfo);
    boundGlobalActions.showModal(modalTypes.SAAS_CHECKOUT_MODAL, {
      product_id,
      aiphotoParams: {
        ...curInfo,
        combos: combos || aiphotoInfo.slice(1),
      },
      liveParams: comboCode
        ? {
            ...curInfo,
            combos: livePhotoInfo.slice(1),
          }
        : undefined,
      level: curInfo?.level_id || level_id,
      cycle: curInfo?.cycle_id || 1,
      escapeClose: true,
      onClosed: () => {
        boundGlobalActions.hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
        boundGlobalActions.getMySubscription(saasBaseUrl);
      },
    });
    // history.push('/software/checkout-plan');
  };

  componentDidMount() {
    this.haveBought();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.isShowMyCoupon !== prevState.isShowMyCoupon ||
      prevState.currentTab !== this.state.currentTab
    ) {
      this.getCouponList();
    }
  }
  haveBought = () => {
    const { urls, userInfo } = this.props;
    const customerId = userInfo.get('id');
    const baseUrl = urls && urls.get('baseUrl');
    const params = {
      // moduleCode: 'EDIT_IMAGE',
      baseUrl,
      customerId,
    };
    getAISubscribeLIST(params).then(res => {
      const AICombo = this.initHaveBoughtData(res);
      this.setState({
        AICombo,
      });
    });
  };

  initHaveBoughtData = data => {
    let list = null;
    list =
      data.map(item => {
        let curInfo = Object.create(null),
          product_name = '',
          unit = '',
          product_id;
        if (item.moduleCode === 'ALBUM_LIVE') {
          product_name = '照片直播';
          unit = '场';
          product_id = saasProducts.live;
          const obj = livePhotoInfo.find(subItem => subItem.comboCode === item.chargePolicyCode);
          curInfo = { ...obj };
          curInfo.nowPrice = typeof curInfo.nowPrice === 'number' ? curInfo.nowPrice : 199;
          curInfo.undercarriaged = !obj;
        } else if (item.moduleCode === 'ALBUM_EDIT_IMAGE') {
          product_name = '智能修图';
          unit = '场';
          product_id = saasProducts.aiphoto;
          const obj = aiphotoInfoFields.find(
            subItem => subItem.comboCode === item.chargePolicyCode
          );
          curInfo = { ...obj };
        } else if (item.moduleCode === 'MEITU_EDIT_IMAGE') {
          product_name = '智能修图';
          unit = '张';
          product_id = saasProducts.aiphoto;
          const obj = aiphotoDelicacyInfo.find(
            subItem => subItem.comboCode === item.chargePolicyCode
          );
          curInfo = { ...obj };
          // 精修体验版套餐价格为0
          if (item.chargePolicyCode === 'MEITU_EDIT_IMAGE_TIYAN') {
            curInfo.nowPrice = 0;
          } else if (item.chargePolicyCode === 'MEITU_EDIT_IMAGE_100') {
            // 精修100张（运营活动）价格为30
            curInfo.nowPrice = 30;
          } else if (item.chargePolicyCode === 'MEITU_EDIT_IMAGE_500') {
            // 精修500张（运营活动）价格为150
            curInfo.nowPrice = 150;
          }
        } else {
          product_name = '智能修图';
          unit = '张';
          product_id = saasProducts.aiphoto;
          curInfo = aiphotoInfo.find(subItem => subItem.comboCode === item.chargePolicyCode);
        }
        return {
          ...item,
          plan_name: item.chargePolicyName,
          product_id,
          product_name,
          plan_level: curInfo ? curInfo.level_id : null,
          price: curInfo ? curInfo.nowPrice : null,
          storage_info: {
            max_size: item.maxAmount,
            usage_size: item.usedAmount,
            unit,
          },
          undercarriaged: curInfo?.undercarriaged,
          createTime: item?.expiredTime, // 已购套餐中，原下单时间改为到期时间
        };
      }) || [];

    return list;
  };

  onRenew = () => {
    const { history } = this.props;

    window.logEvent.addPageEvent({
      name: 'SAASUS_PC_MySubscription_Click_PickAPlan',
      page_name: 'my-subscription',
    });

    history.push('/software/checkout-plan');
  };

  checkIsAllFree = items => {
    let is = true;
    if (items && items.size) {
      is = !items.find(v => !v.get('is_free'));
    }

    return is;
  };

  checkoutSubscription = index => {
    this.setState({
      curCheckout: index,
    });
  };

  getCouponList = async () => {
    const { userInfo, urls } = this.props;
    const { currentTab } = this.state;
    const params = {
      baseUrl: urls.get('baseUrl'),
      customerId: userInfo.get('uidPk'),
      isUse: !!currentTab,
    };

    try {
      const data = await getCustomerDeliveryList(params);
      this.setState({
        couponList: data || [],
      });
    } catch (error) {
      console.log('getCustomerDeliveryList', error);
    }
  };

  showMyCoupon = (show = true, key) => {
    if (show && key === 'isShowMyCoupon') {
      window.logEvent.addPageEvent({
        name: 'MySubscription_Click_MyCoupon',
      });
    }
    if (show && key === 'isShowOrder') {
      window.logEvent.addPageEvent({
        name: 'MySubscription_Click_MyOrder',
      });
    }
    this.setState({
      [key]: show,
    });
  };

  openRights = () => {
    const { urls } = this.props;
    window.open(urls.get('baseUrl') + 'coupon.html');
  };

  changeTab = tab => {
    this.setState({
      currentTab: tab,
      couponList: [],
    });
  };

  showProductRights = () => {
    window.logEvent.addPageEvent({
      name: 'MySubscription_Click_Check',
    });

    const {
      boundGlobalActions: { showModal, hideModal },
      urls,
    } = this.props;
    showModal(modalTypes.SHOW_PRODUCT_RIGHTS_MODAL, {
      close: () => {
        hideModal(modalTypes.SHOW_PRODUCT_RIGHTS_MODAL);
      },
      baseUrl: urls.get('baseUrl'),
    });
  };

  getRenderSubscription = mySubscription => {
    const { checkoutTexts, curCheckout, AICombo, isShowMyCoupon, isShowOrder, currentTab } =
      this.state;
    //我的优惠券
    if (isShowMyCoupon) {
      return this.renderMyCoupon();
    }
    if (isShowOrder) {
      const { userAuth, urls, boundGlobalActions, planList } = this.props;
      return (
        <OrderComp
          userAuth={userAuth}
          urls={urls}
          showMyCoupon={this.showMyCoupon}
          boundGlobalActions={boundGlobalActions}
          planList={planList}
        />
      );
    }

    let subscriptionItem = mySubscription.get('items');
    if (curCheckout === 1) {
      subscriptionItem = fromJS(AICombo);
      console.log('subscriptionItem', subscriptionItem.toJS(), mySubscription.toJS());
    }
    const isAllFree = this.checkIsAllFree(subscriptionItem);
    return (
      <Fragment>
        <div className="subscription-header">
          <div className="my-subscription-title section-title">{t('SUBSCRIPTION')}</div>
          <div className="subscription_checkout">
            {checkoutTexts.map((item, idx) => (
              <span
                key={idx}
                className={`subscript_item ${curCheckout === idx ? 'cur' : ''}`}
                onClick={() => this.checkoutSubscription(idx)}
              >
                {item}
              </span>
            ))}
            {__isCN__ && (
              <Fragment>
                <div
                  className="my-coupon"
                  onClick={() => this.showMyCoupon(true, 'isShowMyCoupon')}
                >
                  {t('MY_COUPON')}
                </div>
                <div className="my-order" onClick={() => this.showMyCoupon(true, 'isShowOrder')}>
                  订单记录
                </div>
              </Fragment>
            )}
          </div>

          {/*<XButton className="upgrade-btn" onClicked={this.onUpgrade}>{t('ORDER_PAY')}</XButton>*/}
        </div>
        <div className="subscription-form">
          <div className="subscription-form-header subscription-item-line">
            {formKeys(curCheckout).map(key => (
              <div>{t(formKeyLabels[key])}</div>
            ))}
          </div>
          {subscriptionItem.map(item => {
            let remaining_time = item.getIn(['details', 'remaining_time']) || 0;
            remaining_time = remaining_time <= 0 ? 0 : remaining_time;
            const product_id = item.get('product_id');
            let iconImgSrc = null;
            switch (product_id) {
              case saasProducts.designer:
                iconImgSrc = designerPNG;
                break;
              case saasProducts.gallery:
                iconImgSrc = galleryPNG;
                break;
              case saasProducts.slideshow:
                iconImgSrc = slideshowIcon;
                break;
              case saasProducts.selection:
                iconImgSrc = selectionPNG;
                break;
              case saasProducts.aiphoto:
                iconImgSrc = aiphotoPNG;
                break;
              case saasProducts.live:
                iconImgSrc = livePNG;
                break;
              default:
                break;
            }

            const max_size = item.getIn(['storage_info', 'max_size']);
            const usage_size = item.getIn(['storage_info', 'usage_size']);
            const unit = item.getIn(['storage_info', 'unit']);
            const userStorage = fromJS({ max_size, usage_size, unit, product_id });
            const showRights =
              __isCN__ &&
              product_id === saasProducts.designer &&
              !!item.get('delivery_practicality');
            // 判断是否是直播并且产品计划是最高级
            const livePlanLevelHighTag =
              item.get('plan_level') === 30 && item.get('product_id') === saasProducts.live;
            {
              return (
                product_id !== saasProducts.selection && (
                  <div className="subscription-item-line">
                    <div className="subscription-item plan_type">
                      <img className="gallery-icon" src={iconImgSrc} />
                      <span>{item.get('product_name')}</span>
                    </div>
                    {/* 直播文案更改 */}
                    {/* {livePlanLevelHighTag ? (
                      <div className="subscription-item">{t('QUARTERLY_SUBSCRIPTION')}</div>
                    ) : (
                      <div className="subscription-item">{item.get('plan_name')}</div>
                    )} */}
                    <div className="subscription-item">{item.get('plan_name')}</div>
                    <div className="subscription-item">
                      {/* {item.getIn(['createTime'])
                        ? formatDate(item.getIn(['createTime']))
                        : formatDate(item.getIn(['details', 'expire_time']))} */}
                      {/* 没有时间不展示 */}
                      {item.getIn(['createTime'])
                        ? formatDate(item.getIn(['createTime']))
                        : item.getIn(['details', 'expire_time'])
                        ? formatDate(item.getIn(['details', 'expire_time']))
                        : null}
                    </div>
                    <div className="subscription-item storage-info">
                      <XStorageInfo userStorage={userStorage} />
                    </div>
                    <div className="subscription-item">
                      {!item.get('undercarriaged') ? (
                        <span>￥ {item.get('price')?.toFixed(2)}</span>
                      ) : (
                        <span>已下架</span>
                      )}
                    </div>
                    {/* {curCheckout === 0 && (
                    <div className="subscription-item">
                      {showRights ? (
                        <span className="link-btn" onClick={this.showProductRights}>
                          查看
                        </span>
                      ) : (
                        '-'
                      )}
                    </div>
                  )} */}
                    <div className="subscription-item">
                      {!item.get('undercarriaged') &&
                      item.get('chargePolicyCode') !== 'MEITU_EDIT_IMAGE_100' &&
                      item.get('chargePolicyCode') !== 'MEITU_EDIT_IMAGE_500' ? (
                        <XButton
                          className="upgrade-btn"
                          onClicked={() =>
                            this.onUpgrade(
                              product_id,
                              item.product_name,
                              item.getIn(['chargePolicyCode'])
                            )
                          }
                        >
                          {product_id === saasProducts.aiphoto ||
                          (product_id === saasProducts.live && curCheckout === 1)
                            ? t('BUY', '购买')
                            : '升级&续费'}
                        </XButton>
                      ) : null}
                    </div>
                  </div>
                )
              );
            }
          })}
          {curCheckout === 0 && subscriptionItem.size > 0 ? (
            <div className="subscription-form-total">
              <div className="grow-full">{t('SUBSCRIPTION_COST')}</div>
              <div>{`${mySubscription.get('currency')} ${mySubscription
                .get('total_price')
                .toFixed(2)}`}</div>
            </div>
          ) : null}
          {curCheckout === 0 && subscriptionItem.size === 0 ? (
            <div className="subscription-item-line none-any-plan">{t('YOU_HAVE_NOT_ANY_PLAN')}</div>
          ) : null}
        </div>
      </Fragment>
    );
  };

  // getRenderNoneSubscription = () => {
  //   const { curCheckout } = this.state;
  //   return (
  //     <Fragment>
  //       <div className="subscription-header">
  //         <div className="my-subscription-title">{t('SUBSCRIPTION')}</div>
  //         <div className="sub-title">{t('CURRENT_SUBSCRIPTION')}</div>
  //         {!__isCN__ && (
  //           <XButton className="upgrade-btn" onClicked={this.onRenew}>
  //             {t('PICK_A_PLAN')}
  //           </XButton>
  //         )}
  //       </div>
  //       <div className="subscription-form">
  //         <div className="subscription-form-header subscription-item-line">
  //           {formKeys(curCheckout).map(key => (
  //             <div>{t(formKeyLabels[key])}</div>
  //           ))}
  //         </div>
  //         <div className="subscription-item-line none-any-plan">{t('YOU_HAVE_NOT_ANY_PLAN')}</div>
  //       </div>
  //     </Fragment>
  //   );
  // };

  renderMyCoupon = () => {
    const { currentTab, couponList } = this.state;
    return (
      <Fragment>
        <div className="subscription-header">
          <div className="my-subscription-title section-title">
            {t('SUBSCRIPTION')}
            {' > '}
            {t('MY_COUPON')}
          </div>
        </div>
        <div className="my-coupon-content">
          <div className="tabs">
            {tabList.map(({ label, tab }) => {
              const itemClass = classNames('item', { active: tab === currentTab });
              return (
                <div key={tab} className={itemClass} onClick={() => this.changeTab(tab)}>
                  {label}
                </div>
              );
            })}
            <div className="coupon-back" onClick={() => this.showMyCoupon(false, 'isShowMyCoupon')}>
              {t('BACK')}
            </div>
            {/* <div className="coupon-rights" onClick={() => this.openRights()}>
              {t('我的影像优惠券')}
            </div> */}
          </div>
          {couponList.length > 0 && this.renderCouponList(currentTab, couponList)}
          {couponList.length === 0 && this.renderCouponEmpty()}
          {couponList.length > 0 && (
            <div className="coupon-intro">
              <div className="title">优惠券说明</div>
              <ul className="content">
                <li>
                  优惠券不能兑换现金，不能叠加使用，优惠券抵扣金额不能开具发票，以实付金额开具发票；
                </li>
                <li>优惠券应在有效期内使用，过期作废；</li>
                <li>使用优惠券的订单发生退订时，优惠券不予退还；</li>
                <li>
                  如果已发放的优惠券存在有失公平等不符合运营目的的情形，包括但不仅限于使用外挂获得优惠券、价格配置失误、发券人群失误等，寸心云服有权将您的优惠券回收，使用了优惠券的订单进行取消（实际支付的金额将进行退款）。
                </li>
              </ul>
            </div>
          )}
        </div>
      </Fragment>
    );
  };

  renderCouponList = (currentTab, list) => {
    const listClass = classNames('list', { disabled: !!currentTab });
    return (
      <div className={listClass}>
        {list.map(item => {
          // let contditionLabel = '无门槛';
          let contditionLabel = '年订阅可用';
          if (item.discountConditions.length > 0) {
            contditionLabel = item.discountConditions.map(cItem => {
              if (cItem.conditionType === 'atLeastSubtotal') {
                return `满${cItem.conditionValue}元可用`;
              }
            });
          }

          const itemClass = classNames('item', {
            'is-use': !!currentTab && item.applyStatus,
            'is-time': !!currentTab && !item.applyStatus,
          });

          return (
            <div key={item.couponCode} className={itemClass}>
              <div className="amount">
                <div className="totel">
                  <span className="unit">¥</span>
                  {item.activityDiscountValue}
                </div>
                <div className="condition">{contditionLabel}</div>
              </div>
              <div className="intro">
                <div className="title">{item.activityName}</div>
                <div className="time">
                  有效期：{format(item.startTime)}至{format(item.endTime)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  renderCouponEmpty = () => {
    return (
      <div className="list-empty">
        <img src={noDataSrc} />
        <div className="text">{t('NO_COUPON')}</div>
      </div>
    );
  };

  render() {
    const { mySubscription } = this.props;
    const subscriptionItem = mySubscription.get('items');
    return (
      <div className="my-subscription-page">
        {/* <div className="my-subscription-page-content">
          {subscriptionItem && !subscriptionItem.size
            ? this.getRenderSubscription(mySubscription)
            : this.getRenderNoneSubscription()}
        </div> */}
        <div className="my-subscription-page-content">
          {this.getRenderSubscription(mySubscription)}
        </div>
      </div>
    );
  }
}
