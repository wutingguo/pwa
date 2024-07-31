import React, { Component } from 'react';
import XButton from '@resource/components/XButton';
import { saasProducts } from '@resource/lib/constants/strings';

import galleryIcon from '@common/icons/gallery_icon.png';
import slideshowIcon from '@common/icons/slideshow_icon.png';
import designerIcon from '@common/icons/designer_icon.png';

export default class ConfirmPage extends Component {
  getMessage = item => {
    const {
      currency = '$',
      adjust_cycle,
      cycle,
      cycle_name,
      cycle_cost,
      degradation,
      first_subscribe,
      upgrade,
      upgrade_cost,
      plan_name
    } = item;
    // case1:【升级 + 调周期】
    if (upgrade && adjust_cycle) {
      return [
        <div>{t('CONFIRM_SUBSCRIPTION_UPGRADE', { cost: `${currency}${upgrade_cost}` })}</div>,
        <div style={{height: 20}}/>,
        <div>{t('CONFIRM_SUBSCRIPTION_ADJUST_CYCLE', { cycle: cycle_name, cost: `${currency}${cycle_cost}`, })}</div>
      ]
    }

    // case2:【升级 + 不调周期】
    if (upgrade && !adjust_cycle) {
      return <div>{t('CONFIRM_SUBSCRIPTION_UPGRADE', { cost: `${currency}${upgrade_cost}` })}</div>
    }

    // case3:【降级 + 调周期】
    if (degradation && adjust_cycle) {
      return [
        <div>{t('CONFIRM_SUBSCRIPTION_DEUPGRADE')}</div>,
        <div style={{height: 20}}/>,
        <div>{t('CONFIRM_SUBSCRIPTION_ADJUST_CYCLE', { cycle: cycle_name, cost: `${currency}${cycle_cost}` })}</div>
      ]
    }

    // case4:【降级 + 不调周期】
    if (degradation && !adjust_cycle) {
      return <div>{t('CONFIRM_SUBSCRIPTION_DEUPGRADE')}</div>
    }

    // case5:【新增功能，第一次订阅】
    if (first_subscribe) {
      return <div>{plan_name}</div>
    }

    // case6:【只调周期】
    if (adjust_cycle) {
      return <div>{t('CONFIRM_SUBSCRIPTION_ADJUST_CYCLE', { cycle: cycle_name, cost: `${currency}${cycle_cost}` })}</div>;
    }

    return '';
  };

  render() {
    const { onBack, onConfirm, orderConfirmInfo } = this.props;
    const {
      product_list
    } = orderConfirmInfo;

    return <div className="sass-checkout-content">
      <div className="confirm-header">
        <label className="back-btn" onClick={onBack}>
          {`< ${t('BACK')}`}
        </label>
        <div className="sub-tooltip">
          {t('CONFIRM_SUBSCRIPTION_CHANGE')}
        </div>
      </div>
      <div className="subscription-form">
        <div className="subscription-form-header subscription-item-line">
          <div>{t('PRODUCT')}</div>
          <div>{t('DETAILS')}</div>
        </div>
        {
          product_list.map(m => {
            console.log(m)
            const product_code = m.product_code;
            let iconImgSrc = null;
            switch (product_code) {
              case saasProducts.designer:
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
            return <div key={m.plan_id} className="subscription-item-line">
              <div className="subscription-item plan_type">
                <img className="gallery-icon" src={iconImgSrc} />
                <span>{m.product_name}</span>
              </div>
              <div className="subscription-item">{this.getMessage(m)}</div>
            </div>
          })
        }

        <div className="subscription-item-line pos-relative">
          <XButton onClicked={onConfirm} className="confirm-change">{t('CONFIRM_CHANGES')}</XButton>
        </div>
      </div>
    </div>
  }
}