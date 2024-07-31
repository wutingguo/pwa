import React, { Fragment } from 'react';

import { get } from 'lodash';
import { fromJS } from 'immutable';
import XStorageInfo from '@resource/components/pwa/XStorageInfo';
import XButton from '@resource/components/XButton';

import XLink from '@resource/components/XLink';

import XPureComponent from '@resource/components/XPureComponent';

import { saasProducts } from '@resource/lib/constants/strings';
import { navigateToWwwOrSoftware } from '@resource/lib/utils/history';
import { relativeUrl } from '@resource/lib/utils/language';
import { displayPrice } from '@resource/lib/utils/currency';

import galleryIcon from '@common/icons/gallery_icon.png';
import slideshowIcon from '@common/icons/slideshow_icon.png';
import designerIcon from '@common/icons/designer_icon.png';
import './index.scss';

const formKeys = ['product_name', 'plan_name', 'details', 'price'];
const formKeyLabels = {
  'plan_name': 'PLAN',
  'details': 'DETAILS',
  'product_name': 'PRODUCT',
  'price': 'COST',
};

export default class MySubscription extends XPureComponent {
  state = { mySubscription: null, urls: null };
  onUpgrade = () => {
    const { history } = this.props;

    window.logEvent.addPageEvent({
      name: 'MySubscription_Click_Upgrade',
      page_name: 'my-subscription'
    });

    // history.push('/software/checkout-plan');
    window.location.href = '/saascheckout.html?from=saas';
  };

  onRenew = () => {
    const { history } = this.props;

    window.logEvent.addPageEvent({
      name: 'SAASUS_PC_MySubscription_Click_PickAPlan',
      page_name: 'my-subscription'
    });

    // history.push('/software/checkout-plan');
    window.location.href = '/saascheckout.html?from=saas';
  };

  checkIsAllFree = items => {
    let is = true;
    if (items && items.size) {
      is = !items.find(v => !v.get('is_free'));
    }

    return is;
  };

  getRenderSubscription = (mySubscription) => {
    const wwwUrl = this.props.urls.get("wwwBaseUrl")
    const subscriptionItem = mySubscription.get('items');
    const isAllFree = this.checkIsAllFree(subscriptionItem);
    const isZDFree = subscriptionItem.size && subscriptionItem.find(item => item.get('is_free') && item.get('product_id') === saasProducts.designer);
    const designerUrl = `${wwwUrl}designer.html`;
    return <Fragment>
      <div className="subscription-header">
        <div className="my-subscription-title">{t('SUBSCRIPTION')}</div>
        <div className="sub-title">{t('CURRENT_SUBSCRIPTION')}</div>

        {
          isAllFree ? null : !__isCN__ ? (
            <div className="title-desc">
              {t('SUBSCRIPTION_TITLE_DESC_01')}
              <strong> {mySubscription.get('cycle')} </strong>
              {t('SUBSCRIPTION_TITLE_DESC_02')}
              <strong> {mySubscription.get('expire_time_str')} </strong>
            </div>
          ) : null
        }

        {!__isCN__ ? (
          <XButton className="upgrade-btn" onClicked={this.onUpgrade}>{t('UPGRADE')}</XButton>
        ) : null}
      </div>
      <div className="subscription-form">
        <div className="subscription-form-header subscription-item-line">
          {formKeys.map(key => (
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

          const max_size = item.getIn(['storage_info', 'max_size']);
          const usage_size = item.getIn(['storage_info', 'usage_size']);
          const unit = item.getIn(['storage_info', 'unit']);
          const isZD = product_id == saasProducts.designer;
          const isNotFree = !item.getIn(['is_free']);

          const userStorage = fromJS({ max_size, usage_size, unit });
          return (
            <div className="subscription-item-line">
              <div className="subscription-item plan_type">
                <img className="gallery-icon" src={iconImgSrc} />
                <span>{item.get('product_name')}</span>
              </div>
              <div className="subscription-item">{item.get('plan_name')}</div>
              <div className="subscription-item storage-info">
                {
                  // 如果是zd服务并且是真实的收费项目（非虚拟的）
                  isZD ? (isNotFree && !item.get("unreal_subscribe") ?
                    <XLink
                      href={`${wwwUrl}zno-lab-credits-details.html`}
                      className="zd-nav default">{t('ZNO_LAB_CREDITS_DETAILS')} &gt;
                    </XLink> : null) : <XStorageInfo userStorage={userStorage} />
                }
              </div>
              <div className="subscription-item">
                {/* {mySubscription.get('currency')} {item.get('price').toFixed(2)} */}
                {displayPrice(mySubscription.get('currency'), item.get('price'))}
              </div>
            </div>
          );
        })}
        <div className="subscription-form-total">
          <div className="grow-full">{t("SUBSCRIPTION_COST")}</div>
          <div>
            {/* {`${mySubscription.get('currency')} ${mySubscription.get('total_price').toFixed(2)}`} */}
            {displayPrice(mySubscription.get('currency'), mySubscription.get('total_price'))}
          </div>
        </div>
      </div>
      {isZDFree && <p className="guide-content" dangerouslySetInnerHTML={{ __html: t('GUIDE_CONTENT', { wwwDesigner: designerUrl, znoLabAbove: t('ZNO_LAB_ABOVE') }) }} />}
    </Fragment>
  };


  getRenderNoneSubscription = () => {
    return <Fragment>
      <div className="subscription-header">
        <div className="my-subscription-title">{t('SUBSCRIPTION')}</div>
        <div className="sub-title">{t('CURRENT_SUBSCRIPTION')}</div>
        {!__isCN__ && <XButton className="upgrade-btn" onClicked={this.onRenew}>{t('PICK_A_PLAN')}</XButton>}
      </div>
      <div className="subscription-form">
        <div className="subscription-form-header subscription-item-line">
          {formKeys.map(key => (
            <div>{t(formKeyLabels[key])}</div>
          ))}
        </div>
        <div className="subscription-item-line none-any-plan">
          {t('YOU_HAVE_NOT_ANY_PLAN')}
        </div>
      </div>
    </Fragment>
  };

  render() {
    const { mySubscription } = this.props;
    const subscriptionItem = mySubscription.get('items');

    return <div className="my-subscription-page">
      <div className="my-subscription-page-content">
        {
          subscriptionItem && subscriptionItem.size ?
            this.getRenderSubscription(mySubscription) :
            this.getRenderNoneSubscription()
        }
      </div>
    </div>
  }
}
