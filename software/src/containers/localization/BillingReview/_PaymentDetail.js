import React from 'react';
import Title from './_Title';
import XRadio from '@resource/components/XRadio';
import wxIcon from './images/wxPay.png';
import aliIcon from './images/aliPay.png';

export default ({ radioValue, handleChangePayment }) => {

  return (
    <div className="payment-detail">
      <div className="title">
        <Title title={'支付方式'} />
      </div>

      <div className="pay-wrapper">
        <div className="pay-wrap" title="alipay" onClick={handleChangePayment}>
          <XRadio
            skin="blue"
            name="alipay"
            value="alipay"
            title="alipay"
            clicked={handleChangePayment}
            checked={radioValue === 'alipay'}
            className="method-radio"
          />
          <img className="action-icon" title="alipay" src={aliIcon} />
        </div>
        <div className="pay-wrap" title="wxpay" onClick={handleChangePayment}>
          <XRadio
            skin="blue"
            name="wxpay"
            value="wxpay"
            title="wxpay"
            checked={radioValue === 'wxpay'}
            className="method-radio"
          />
          <img className="action-icon" title="wxpay" src={wxIcon} />
        </div>
      </div>
    </div>
  );
};
