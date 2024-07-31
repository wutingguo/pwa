import React, { memo, useEffect, useState } from 'react';

import { getMiniCode, getMiniCodeUrl } from '@apps/gallery-client-mobile/services/project';

import './index.scss';

const MiniCode = props => {
  const { urls, guest_uid, favorite_id, collection_uid } = props;
  const [imgSrc, setImgSrc] = useState(null);
  useEffect(() => {
    // getMiniCode({
    //   baseUrl: urls.wwwBaseUrl,
    //   appId: 'wx361e424837dadfa6',
    //   path: 'pages/orderDetail/index',
    //   scene: `${guest_uid},${favorite_id},${collection_uid}`,
    //   width: '450',
    //   version: '2',
    // }).then(res => {
    //   const url = URL.createObjectURL(res);
    //   setImgSrc(url);
    // });
    setImgSrc(
      getMiniCodeUrl({
        baseUrl: urls.wwwBaseUrl,
        appId: 'wx361e424837dadfa6',
        path: 'pages/galleryClientHome/index',
        scene: collection_uid,
        width: '450',
        version: '2',
      })
    );
  }, []);
  return (
    <div className="MiniCode">
      <div>为了您的支付安全，请在小程序内完成支付</div>
      <img src={imgSrc} alt="" />
      <div>长按保存图片，使用微信扫码</div>
    </div>
  );
};

export default memo(MiniCode);
