import React from 'react';
import {template} from 'lodash';
import wxIphone from '../images/pc_icon_wx_phone.png';
import { QRCODEURL } from '@resource/lib/constants/apiUrl';
import { relativeUrl } from '@resource/lib/utils/language';

export default ({ code_url, baseUrl }) => {
  const QRCodeUrl = relativeUrl(template(QRCODEURL)({baseUrl, codeUrl: code_url}))
  return (
    <div className="payment-detail">
      <div className="pay-wrapper">
        <div className="pay-wrap" >
          <img className="qrcode-icon" src={QRCodeUrl} />
          <div className="action-text"> 微信扫一扫支付 </div>
        </div>
        <div className="pay-wrap">
          <img className="wx-iphone" src={wxIphone} />
        </div>
      </div>
    </div>
  );
};
