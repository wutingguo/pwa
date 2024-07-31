import React, { memo, useEffect, useMemo, useRef, useState } from 'react';

import { CouponField, FInput } from '../index';

import './index.scss';

const CouponInput = props => {
  const { onChange, value, type = 'text', valueFn = value => value } = props;
  const formChange = e => {
    onChange(valueFn(e.target.value));
  };
  return (
    <div className="couponInputField">
      <FInput type={type} value={value || ''} {...props} onChange={formChange} />
    </div>
  );
};
const CouponInputField = props => {
  const { boundGlobalActions, baseUrl, ...reset } = props;

  return (
    <CouponField {...reset}>
      <CouponInput {...props} />
    </CouponField>
  );
};
export default memo(CouponInputField);
