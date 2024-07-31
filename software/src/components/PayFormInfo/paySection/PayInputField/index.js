import React, { memo, useEffect, useMemo, useRef, useState } from 'react';

import { FInput, PayField } from '../index';

import './index.scss';

const PayInput = props => {
  const { onChange, value, type = 'text' } = props;
  const formChange = e => {
    onChange(e.target.value);
  };
  return (
    <div className="payInputField">
      <FInput type={type} value={value || ''} onChange={formChange} />
    </div>
  );
};
const PayInputField = props => {
  const { child, boundGlobalActions, baseUrl, ...reset } = props;
  const tempChild = child
    ? child
    : (value, onChange) => {
        return <PayInput {...props} onChange={onChange} value={value} />;
      };
  return <PayField {...reset} child={tempChild} />;
};
export default memo(PayInputField);
