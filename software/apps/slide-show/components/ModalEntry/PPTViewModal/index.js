import React, { Component } from 'react';
import classNames from 'classnames';
import SlideShowPreview from '@resource/components/pwa/SlideShowPreview';
import { packageListMap } from '@resource/lib/constants/strings';

import './index.scss';

class PPTViewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      collectionDetail,
      urls,
      data,
      postCardList,
      usedPostCardDetail,
      mySubscription,
      isHideIcon = false
    } = this.props;
    const contentProps = {
      urls,
      usedPostCardDetail,
      mySubscription,
      showCloseIcon: false,
      onClose: data.get('close'),
      // onAudioEnded: data.get('close'),
      collectionDetail,
      videoSize: {
        width: 700,
        height: 450
      },
      controllerOptions: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        outterPadding: '10px',
        showMuteICon: false
      }
    };
    const iconClassName = classNames('icon-close', {
      hide: isHideIcon
    });
    const planItems = mySubscription && mySubscription.get('items');
    const slideShowItem =
      planItems && planItems.find(el => el.get('product_id') === 'SAAS_SLIDE_SHOW');
    const license = collectionDetail.get('license') || '';

    const isFree =
      (slideShowItem && slideShowItem.get('is_free')) || license.level === packageListMap.free;
    const hasTrailPlanLevel =
      (slideShowItem && slideShowItem.get('trial_plan_level') > 10) ||
      license.trial_plan_level > 10;

    const isShowWaterMark = isFree && !hasTrailPlanLevel;
    return (
      <div className="slide-show-center-preview-modal">
        <div className="slide-show-center-preview-modal-backdrop" onClick={data.get('close')}></div>
        <div className="slide-show-center-preview-modal-content">
          <SlideShowPreview {...contentProps} />
          <span className={iconClassName} onClick={data.get('close')} />
          {!__isCN__ ? <div className="low-resolution-text">{t('LOW_RESOLUTION_TEXT')}</div> : null}
        </div>
      </div>
    );
  }
}

export default PPTViewModal;
