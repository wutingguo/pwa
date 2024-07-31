import cls from 'classnames';
import React from 'react';
import cookie from 'react-cookies';

import { HAS_SHOW_GET_PROMOTION_KEY } from '@resource/lib/constants/strings';

const promotionImg = `/clientassets/portal/v2/images/cloud-pc/workspace/summer-sale.jpg`;
const showPromotion = that => {
  // const hasShowGetStarted = !!cookie.load(HAS_SHOW_GET_PROMOTION_KEY);
  // // 如果没有显示指引. 就显示第一次.
  // if (!hasShowGetStarted) {
  //   // 显示指引.
  //   that.setState({
  //     isShowPromotion: true
  //   });
  // }
};

const updatePromotion = that => {
  that.setState({
    promotionViewed: true,
  });
  setTimeout(() => {
    that.setState({
      isShowPromotion: false,
    });
  }, 1500);
};

// 点击右上角X，收起弹窗，收到右上角的Aniversary Sale处（动画效果参考CN的50元券）
const closePromotion = (e, that) => {
  e.stopPropagation();
  updatePromotion(that);
  window.logEvent.addPageEvent({
    name: 'Workspace_PromoBannerPop_Click_Cancel',
  });
};

const toPromotion = (e, that) => {
  e.stopPropagation();
  updatePromotion(that);
  window.logEvent.addPageEvent({
    name: 'Workspace_PromoBannerPop_Click_GetOffer',
  });
  window.open(`${location.origin}/saaspromo.html`, '_blank');
};

const renderPromotion = that => {
  return (
    <div className={cls('promotion-intro', that.state.promotionViewed && 'popout')}>
      <div className="back-color" />
      <div className="wrapper" onClick={e => closePromotion(e, that)}>
        <div className="content">
          <img src={promotionImg} alt="" className="image" onClick={e => toPromotion(e, that)} />
          <div className="btn" onClick={e => toPromotion(e, that)}></div>
          <span className="close" onClick={e => closePromotion(e, that)}>
            ✖
          </span>
        </div>
      </div>
    </div>
  );
};

export default {
  renderPromotion,
  showPromotion,
};
