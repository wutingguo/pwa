import React, { memo, useEffect, useMemo, useState } from 'react';

import { XIcon } from '@common/components';

import './index.scss';

const ShareModal = props => {
  const { boundGlobalActions, imgSrc } = props;
  const url = `${window.origin}${window.location.pathname}`;
  const brand = window.location.pathname.replace(/\//g, '');
  const showShareMedia = type => {
    //把域名地址当做url的参数,需要encodeURIComponent编码
    let openUrl = '';
    // 根据分享的类型决定分享的URL
    if (type === 'facebook') {
      openUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
    } else if (type === 'pinterest') {
      openUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
        url
      )}&description=${brand}&media=${encodeURIComponent(imgSrc)}`;
    } else if (type === 'twitter') {
      openUrl = 'http://twitter.com/intent/tweet?url=' + encodeURIComponent(url);
    }
    const windowFeatures = 'width=600, height=450,top=100,left=350';
    window.open(openUrl, 'parent', windowFeatures);
  };
  const onCopy = () => {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = url;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    boundGlobalActions.addNotification({
      message: 'copy sucess',
      level: 'info',
      autoDismiss: 2,
    });
  };
  return (
    <div className="shareModal">
      <div className="coflex urlBox">
        <div id="copyUrl">{url}</div>
        <div className="coflex btn" onClick={onCopy}>
          Copy
        </div>
      </div>
      {/* <div className="desc">Anyone with a link can view the gallery</div> */}
      <div className="coflex iconBox">
        <div className="coflex iconBoxList" onClick={() => showShareMedia('facebook')}>
          <XIcon type="facebook" className="favorite-big-wrap" />
          <div className="iconName">Facebook</div>
        </div>
        <div className="coflex iconBoxList" onClick={() => showShareMedia('twitter')}>
          <XIcon type="twitter" className="favorite-big-wrap" />
          <div className="iconName">Twitter</div>
        </div>
        <div className="coflex iconBoxList" onClick={() => showShareMedia('pinterest')}>
          <XIcon type="pinterest" className="favorite-big-wrap" />
          <div className="iconName">Pinterest</div>
        </div>
      </div>
    </div>
  );
};
export default memo(ShareModal);
