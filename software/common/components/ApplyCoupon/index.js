import React, { useEffect, useState } from 'react';

import XButton from '@resource/components/XButton';
import { Input } from '@resource/components/XInput';

import closeIcon from '@resource/static/icons/close.png';

import { applyCouponInClient } from '@common/servers/coupon';

import './index.scss';

const ApplyCoupon = props => {
  const [couponCode, setCouponCode] = useState('');
  const [errTip, setErrTip] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [modalStatus, setModalStatus] = useState(false);
  const { baseUrl, refreshCart, coupon, isMobile } = props;

  useEffect(() => {
    if (coupon) {
      const { coupon_code } = coupon;
      setCouponCode(coupon_code);
    }
  }, [coupon]);

  const applyCode = () => {
    setLoading(true);
    if (!inputCode) {
      return;
    }
    applyCouponInClient({ baseUrl, coupon_code: inputCode })
      .then(res => {
        const { code, errMsg } = res;
        if (code === 200000) {
          setErrTip('');
          refreshCart();
          closeModal();
        } else {
          setErrTip(errMsg);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const closeModal = () => {
    setModalStatus(false);
    setErrTip('');
    setInputCode('');
  };

  return (
    <div className={`apply_coupon_btn ${isMobile ? 'mobile' : ''}`}>
      <span className="btn" onClick={() => setModalStatus(true)}>
        {' '}
        Apply Coupon Code
      </span>
      {couponCode && (
        <div className="tips">{`*Your ${couponCode} coupon code has been applied!`}</div>
      )}
      {modalStatus && (
        <div className="coupon_modal_mask">
          <div className="coupon_modal_content">
            <img className="close" src={closeIcon} onClick={closeModal} />
            <div className="title">Coupon Code</div>
            <div className="input_wrapper">
              <Input value={inputCode} placeholder="Coupon Code" onChange={v => setInputCode(v)} />
              {errTip ? <div className="err_tip">{errTip}</div> : ''}
            </div>
            <div className="btns_wrapper">
              <XButton className="white" onClick={closeModal}>
                Cancel
              </XButton>
              <XButton onClick={applyCode} isShowLoading={loading} isWithLoading={loading}>
                Apply
              </XButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyCoupon;
