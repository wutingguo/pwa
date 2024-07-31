import React, { Fragment } from 'react';
import qs from 'qs';
import { fromJS } from 'immutable';
import { paymentForSubscrible } from '@resource/pwa/services/payment';

import { saasProducts } from '@resource/lib/constants/strings';

import { convertObjIn } from '@resource/lib/utils/typeConverter';
import XPureComponent from '@resource/components/XPureComponent';
import XSelect from '@resource/components/XSelectV1';
import XButton from '@resource/components/XButton';
import { displayPrice } from '@resource/lib/utils/currency';

import ConfirmPage from './_ConfirmPage';
import ConfirmModal from './_ConfirmModal';
import galleryIcon from '@common/icons/gallery_icon.png';
import slideshowIcon from '@common/icons/slideshow_icon.png';
import designerIcon from '@common/icons/designer_icon.png';

import {
  getPlanInfo,
  changePlanCycle,
  changePlanLevel,
  getSummary,
  getPlanConfirm
} from './_handleHelp';

import './index.scss';

export default class Checkout extends XPureComponent {
  constructor(props) {
    super(props);

    this.state = {
      galleryBaseUrl: '',
      summary: {},
      plans: null,
      cycle_list: [],
      level_list: [],
      products: [],
      orderConfirmInfo: {},
      isShowConfirmPage: false
    };

    this.getPlanInfo = () => getPlanInfo(this);
    this.parseUrlParams = this.parseUrlParams.bind(this);
    this.onLevelChange = (...args) => this.onSelectChange('level', ...args);
    this.onCycleChange = (...args) => this.onSelectChange('cycle', ...args);
  }

  parseUrlParams() {
    const urlParams = qs.parse(location.search.split('?')[1]);
    this.setState({ urlParams: convertObjIn(urlParams) });
  }

  onSelectChange(itemKey, planId, itemOption) {
    let plans = this.state.plans;

    if (itemKey === 'level') {
      plans = changePlanLevel({
        plans: this.state.plans,
        planId,
        levelId: itemOption.id
      });
    } else {
      // cycle
      plans = changePlanCycle({
        plans: this.state.plans,
        cycleId: itemOption.id
      });
    }

    this.setState({ plans }, () => getSummary(this));
  }

  handleContinue = () => {

    getPlanConfirm(this);
  };

  hideConfirmModal = () => {
    const { boundGlobalActions } = this.props;

    boundGlobalActions.hideConfirm();
    this.setState({ isShowConfirmPage: false, orderConfirmInfo: {} });
  }

  onConfirmChange = () => {
    window.logEvent.addPageEvent({
      name: 'Checkout_Click_Confirmchanges',
      page_name: 'saascheckout'
    });

    const { history, boundGlobalActions, urls } = this.props;
    const { orderConfirmInfo } = this.state;
    const { card_token, product_list } = orderConfirmInfo;
    const galleryBaseUrl = urls.get('galleryBaseUrl');

    const subscribe_orders = product_list.map(m => {
      return {
        plan_id: m.plan_id,
        product_id: m.product_code
      };
    });

    const createPlanOrder = (body) => {
      boundGlobalActions.showGlobalLoading();
      paymentForSubscrible(body, galleryBaseUrl).then(result => {
        boundGlobalActions.hideGlobalLoading();

        // history.push('/software/success');
        const origin = window.location.origin;
        const href = origin + '/software/success';
        window.location.href = href;
      }).catch(err => {
        boundGlobalActions.addNotification({
          message: err,
          level: 'error',
          autoDismiss: 3
        });

        boundGlobalActions.hideGlobalLoading();
      });
    };

    // cn 暂无支付流程
    if (__isCN__) {
      createPlanOrder({
        subscribe_orders,
        card_token: 0,
        nonce: 0,
        payment_gateway: 'BRAINTREE',
        save_card: true
      });
      return;
    }

    // 说明已经绑定过卡. 可以直接支付.
    if (card_token) {
      createPlanOrder({
        subscribe_orders,
        card_token,
        payment_gateway: 'BRAINTREE',
        save_card: true
      });
    } else {
      // 1. 先判断是否所有的plan都为free. 直接创建free order,不需要绑卡.
      // 2. 否则跳转到绑卡页面.
      const hasNotFree = product_list.some(m => m.plan_name !== 'Free');

      if (hasNotFree) {
        history.push(`/software/payment?subscribe_orders=${encodeURIComponent(JSON.stringify(subscribe_orders))}`);
      } else {
        createPlanOrder({
          subscribe_orders,
          payment_gateway: 'BRAINTREE',
          save_card: true
        });
      }
    }
  };

  componentDidMount() {
    window.logEvent.addPageEvent({
      name: 'GalleryCheckout'
    });

    this.parseUrlParams();
    this.getPlanInfo();
  }

  render() {
    const { boundGlobalActions } = this.props;

    const {
      plans,
      cycleOptions,
      summary = {},
      isShowConfirmPage,
      orderConfirmInfo
    } = this.state;
    const {
      summary_total,
      summaryCurrentCycle,
      summaryCurrency,
      summaryProducts
    } = summary;
    let selectedCycle;
    if (cycleOptions && cycleOptions.length && summaryCurrentCycle) {
      selectedCycle = cycleOptions.find(v => v.id === summaryCurrentCycle.id) || cycleOptions[0];
    }

    const confirmPageProps = {
      onConfirm: this.onConfirmChange,
      onBack: this.hideConfirmModal,
      orderConfirmInfo
    };

    const { product_list } = orderConfirmInfo;

    // 点击continue后, 如果product_list为空，说明没有选项更改, 不需要进入下一步.
    const isShowConfirmModal = isShowConfirmPage && (!product_list || !product_list.length);

    const confirmModalProps = {
      boundGlobalActions,
      data: {
        message: t('NO_UPGRADE_ITEMS_MESSAGE'),
        close: this.hideConfirmModal,
        buttons: [
          {
            onClick: this.hideConfirmModal,
            text: t('CLOSE')
          }
        ]
      }
    };

    const subfix = __isCN__ ? '' : ` ${t('PLAN')}`;

    return (
      <div className="sass-checkout">
        {
          isShowConfirmPage && !isShowConfirmModal ? <ConfirmPage {...confirmPageProps} /> :
            plans ? (
              <div className="sass-checkout-content">
                <div className="page-title">{t("SUBSCRIBE_PLAN")}</div>
                <div className="checkout-container">
                  <div className="subscribe-list">
                    {
                      plans.map(m => {
                        let {
                          currentPrice,
                          currentLevel,
                          currentCycle,
                          level_list,
                          cycle_list,
                          product_code,
                          product_id,
                          product_name
                        } = m;

                        let iconImgSrc = null;
                        switch (product_id) {
                          case saasProducts.designer:
                            level_list = level_list.map(item => ({ ...item, label: item.alias }));
                            currentLevel = { ...currentLevel, label: currentLevel.alias };
                            iconImgSrc = designerIcon;
                            break;
                          case saasProducts.gallery:
                            iconImgSrc = galleryIcon;
                            break;
                          case saasProducts.slideshow:
                            iconImgSrc = slideshowIcon;
                            break;
                          default:
                            break;
                        }

                        const isShowOriginalPrice = currentPrice.original_price &&
                          currentPrice.price !== currentPrice.original_price &&
                          currentPrice.original_price !== 0;

                        return <div className="subscribe-description">
                          <div className="subscribe-summary">
                            <div className="product-detail">
                              <img src={iconImgSrc} />
                              <span>{product_name}</span>
                            </div>
                            <div className="product-type">
                              <label>{t("PLAN")}:</label>
                              <XSelect
                                searchable={false}
                                clearable={false}
                                options={level_list}
                                value={currentLevel}
                                onChanged={this.onLevelChange.bind(this, product_id)}
                              />
                            </div>
                          </div>
                          <div className="product-monthly-price">
                            {
                              isShowOriginalPrice ? (
                                <div className="original-price">
                                  <span className="price-number">
                                    {/* {currentPrice.currency}{currentPrice.original_price.toFixed(2)} */}
                                    {displayPrice(currentPrice.currency, currentPrice.original_price)}
                                  </span>
                                  <span>/{currentCycle.alias}</span>
                                </div>
                              ) : null
                            }
                            <div className="current-price">
                              <span className="price-number">
                                {/* {currentPrice.currency}{currentPrice.price.toFixed(2)} */}
                                {displayPrice(currentPrice.currency, currentPrice.price)}
                              </span>
                              <span>/{currentCycle.alias}</span>
                            </div>
                          </div>
                        </div>
                      })
                    }
                  </div>
                  {
                    selectedCycle ? (
                      <div className="subscribe-detail">
                        <div className="subscribe-item">
                          <div className="summary-title">{t('SUMMARY')}</div>
                        </div>
                        <div className="subscribe-item subscribe-cycle">
                          <span>{t("BILLING_CYCLE")}</span>
                          <XSelect
                            searchable={false}
                            clearable={false}
                            options={cycleOptions}
                            value={selectedCycle}
                            onChanged={this.onCycleChange.bind(this, 'cycle')}
                          />
                        </div>
                        {
                          summaryProducts ? summaryProducts.map(plan => {
                            return <div className="subscribe-item" key={plan.plan_id}>
                              <span>{plan.product_name} - {plan.plan_name}</span>
                            </div>
                          }) : null
                        }

                        <div className="subscribe-item">
                          <span>{t("TOTAL")}</span>
                          <div className="total-price">
                            <span className="price-number">
                              {/* {summaryCurrency}{summary_total.toFixed(2)} */}
                              {displayPrice(summaryCurrency, summary_total)}
                            </span>
                            <span>/{selectedCycle.alias}</span>
                          </div>
                        </div>
                        <XButton
                          className='black gallery-subscribe-button'
                          onClicked={this.handleContinue}
                        >{t("CONTINUE")}</XButton>
                      </div>) : null
                  }
                </div>
              </div>) : null
        }

        {
          isShowConfirmModal ? <ConfirmModal {...confirmModalProps} /> : null
        }
      </div>
    );
  }
}
