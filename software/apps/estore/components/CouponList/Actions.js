import React, { memo, useState } from 'react';

import { XDropdown, XIcon } from '@common/components';

import { ACTIONSTYPE, getDropdownList } from './config';

import './index.scss';

const CouponActions = ({ info, couponType, onOperateCoupon }) => {
  const { coupon_id, display_status } = info;
  const actionFn = targetItem => {
    onOperateCoupon(targetItem['key'], coupon_id);
  };
  const props = {
    customClass: 'couponActions-dropdown-wrapper',
    label: '',
    arrow: 'right',
    dropdownList: getDropdownList({ actionFn, couponType, display_status }).map(item => ({
      ...item,
      label: (
        <>
          <XIcon className="couponDropdownicon" type={item.icon} />
          <div className="dropdownLabel">{item.label}</div>
        </>
      ),
    })),
    renderLable: () => <XIcon className="favorite-more-icon" type="more-1" />,
  };

  return (
    <div className="couponActions">
      <XIcon
        className="couponDropdownicon coupon-edit-icon"
        type="rename"
        onClick={() => onOperateCoupon(ACTIONSTYPE.Edit, coupon_id)}
      />
      <XDropdown {...props} />
    </div>
  );
};

export default memo(CouponActions);
