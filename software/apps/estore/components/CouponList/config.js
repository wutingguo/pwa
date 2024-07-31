import moment from 'moment';
import React from 'react';

import Actions from './Actions';

//下拉框类型
export const ACTIONSTYPE = {
  Edit: 'Edit',
  Disable: 'Disable',
  Delete: 'Delete',
  Activate: 'Activate',
};
//优惠券类型
export const COUPON_TYPE = {
  Active: 'Active',
  Scheduled: 'Scheduled',
  Inactive: 'Inactive',
};
export const contrast = {
  1: 'Scheduled',
  2: 'Active',
  4: 'Expired',
  8: 'Disabled',
};
export const MODAL_INFOS = {
  [ACTIONSTYPE['Activate']]: {
    title: 'Activate Coupon?',
    message:
      'Are you sure you want to activate this coupon? A coupon may be listed as active, scheduled or expired after the activation based on its start and end date.',
    confirmBtnText: 'Activate',
  },
  [ACTIONSTYPE['Disable']]: {
    title: 'Disable Coupon?',
    message:
      'Are you sure you want to disable this coupon? Once a coupon is disabled, on no account can it be applied at checkout.',
    confirmBtnText: 'Disable',
  },
  [ACTIONSTYPE['Delete']]: {
    title: 'Delete Coupon?',
    message:
      'Are you sure you want to delete this coupon? This cannot be undone. A deleted coupon cannot be applied at checkout.',
    confirmBtnText: 'Delete',
  },
};
export const getTableColumns = (couponType, onOperateCoupon) => [
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    align: 'left',
    width: 260,
    render(value, item) {
      return (
        <div>
          <div>{value}</div>
          <div style={{ fontSize: '14px', marginTop: '6px', color: 'rgba(58, 58, 58, 0.6)' }}>
            {item.decrease_amount}% off
          </div>
        </div>
      );
    },
  },
  {
    title: 'Code',
    key: 'code',
    dataIndex: 'code',
    align: 'left',
    width: 200,
    // render(value, item) {
    //   return `BLACK FRIDAY23`;
    // },
  },
  {
    title: 'Status',
    key: 'display_status',
    dataIndex: 'display_status',
    align: 'left',
    // width: 160,
    render(value, item) {
      return contrast[value];
    },
  },
  {
    title: 'Active',
    key: 'active',
    dataIndex: 'active',
    align: 'left',
    render(value, item) {
      return item.end_date ? (
        <div>
          {' '}
          <div>{moment(item.start_date).format('MMM DD, YYYY')} - </div>
          <div>{moment(item.end_date).format('MMM DD, YYYY')}</div>
        </div>
      ) : (
        <div>
          {' '}
          <div>{moment(item.start_date).format('MMM DD, YYYY')} - </div>
          <div>No end date</div>
        </div>
      );
    },
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    align: 'center',
    width: 200,
    render: (value, item) => {
      return <Actions info={item} couponType={couponType} onOperateCoupon={onOperateCoupon} />;
    },
  },
];
export const getDropdownList = ({ actionFn, couponType, display_status }) => {
  if (couponType === COUPON_TYPE['Inactive'] && display_status === 8) {
    return [
      {
        id: 1,
        label: 'Edit',
        icon: 'rename',
        key: ACTIONSTYPE['Edit'],
        action: actionFn,
      },
      {
        id: 2,
        label: 'Activate',
        icon: 'activate',
        key: ACTIONSTYPE['Activate'],
        action: actionFn,
      },
      {
        id: 3,
        label: 'Delete',
        icon: 'delete',
        key: ACTIONSTYPE['Delete'],
        action: actionFn,
      },
    ];
  }
  return [
    {
      id: 1,
      label: 'Edit',
      icon: 'rename',
      key: ACTIONSTYPE['Edit'],
      action: actionFn,
    },
    {
      id: 2,
      label: 'Disable',
      icon: 'disable',
      key: ACTIONSTYPE['Disable'],
      action: actionFn,
    },
    {
      id: 3,
      label: 'Delete',
      icon: 'delete',
      key: ACTIONSTYPE['Delete'],
      action: actionFn,
    },
  ];
};
