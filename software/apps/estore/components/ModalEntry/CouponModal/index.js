import React, { memo, useEffect, useState } from 'react';

import { XLoading, XModal } from '@common/components';

import * as localModalTypes from '@apps/estore/constants/modalTypes';
import estoreService from '@apps/estore/constants/service';

import CouponFormInfo from '../../CouponDetail';

import './index.scss';

const CouponModal = props => {
  const { data, boundGlobalActions } = props;
  const { baseUrl, coupon_id, store_id, imgBaseUrl, customer_id, callBackFn, currency_symbol } =
    data.toJS() || {};
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [rackList, setRackList] = useState([]);
  const closeModal = () => {
    if (isEdit) {
      // 编辑状态时提示
      boundGlobalActions.showConfirm({
        close: () => {
          boundGlobalActions.hideConfirm();
        },
        title: '',
        message: 'There are unsaved edits. Are you sure you want to leave the page?',
        buttons: [
          {
            text: t('CANCEL'),
            className: 'white',
          },
          {
            text: 'Leave',
            onClick: () => {
              callBackFn && callBackFn();
              boundGlobalActions.hideModal(localModalTypes.COUPON_FORM_MODAL);
            },
          },
        ],
      });
    } else {
      callBackFn && callBackFn();
      boundGlobalActions.hideModal(localModalTypes.COUPON_FORM_MODAL);
    }
  };
  useEffect(() => {
    setLoading(true);
    estoreService.estoreGetList({ baseUrl, store_id }).then(res => {
      // console.log('res', res);
      setRackList(res.data || []);
      setLoading(false);
    });
  }, []);
  return (
    <XModal className="CouponFormModal" isHideIcon={true} opened onClosed={() => {}}>
      <XLoading type="listLoading" isShown={loading} backgroundColor="rgba(255,255,255,0.5)" />
      <CouponFormInfo
        setLoading={setLoading}
        baseUrl={baseUrl}
        boundGlobalActions={boundGlobalActions}
        closeModal={closeModal}
        setIsEdit={setIsEdit}
        isEdit={isEdit}
        coupon_id={coupon_id}
        rackList={rackList}
        imgBaseUrl={imgBaseUrl}
        customer_id={customer_id}
        currency_symbol={currency_symbol}
      />
    </XModal>
  );
};

export default memo(CouponModal);
