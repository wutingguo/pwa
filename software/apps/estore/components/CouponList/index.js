import moment from 'moment';
import Table from 'rc-table';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import * as localModalTypes from '@apps/estore/constants/modalTypes';
import estoreService from '@apps/estore/constants/service';

import { ACTIONSTYPE, COUPON_TYPE, MODAL_INFOS, getTableColumns } from './config';

import './index.scss';

const CouponList = props => {
  const { boundGlobalActions, estoreInfo, urls, userInfo } = props;
  const modalAction = useCallback((modalInfo, callBack) => {
    boundGlobalActions.showConfirm({
      close: () => {
        boundGlobalActions.hideConfirm();
      },
      title: modalInfo.title,
      message: <div style={{ textAlign: 'left' }}>{modalInfo.message}</div>,
      buttons: [
        {
          text: t('CANCEL'),
          className: 'white',
        },
        {
          text: modalInfo.confirmBtnText,
          onClick: () => {
            callBack & callBack();
            boundGlobalActions.hideConfirm();
          },
        },
      ],
    });
  });
  const [list, setList] = useState([]);
  const [couponType, setCouponType] = useState('Active');
  const couponTypeList = useMemo(() => {
    return [COUPON_TYPE['Active'], COUPON_TYPE['Scheduled'], COUPON_TYPE['Inactive']];
  }, []);
  const getList = () => {
    estoreService
      .getCouponList({
        baseUrl: urls.get('estoreBaseUrl'),
      })
      .then(res => {
        if (res.ret_code === 200000) {
          setList(res.data.coupon_groups);
        }
      });
  };
  const viewList = useMemo(() => {
    const res = {};
    list.forEach(item => {
      if (item.display_status === 2) {
        res[COUPON_TYPE['Active']] = item.coupons;
      } else if (item.display_status === 1) {
        res[COUPON_TYPE['Scheduled']] = item.coupons;
      } else {
        res[COUPON_TYPE['Inactive']] = item.coupons;
      }
    });
    return res;
  }, [list]);
  useEffect(() => {
    getList();
  }, []);
  const onSelectType = item => {
    setCouponType(item);
  };
  const onOperateCoupon = (key, coupon_id) => {
    const callBack = () => {
      const contrast = {
        Disable: {
          operation_type: 4,
          tip: 'Coupon disabled.',
        },
        Activate: {
          operation_type: 8,
          tip: 'Coupon activated.',
        },
        Delete: {
          operation_type: 16,
          tip: 'Coupon deleted.',
        },
      };
      estoreService
        .manageCoupon({
          baseUrl: urls.get('estoreBaseUrl'),
          params: {
            customer_id: userInfo.get('uidPk'),
            coupon_id,
            operation_type: contrast[key]['operation_type'], //4-禁用，8-激活，16-删除
          },
        })
        .then(() => {
          getList();
          boundGlobalActions.addNotification({
            message: contrast[key]['tip'],
            level: 'success',
            autoDismiss: 3,
          });
        });
    };
    let modalInfo = MODAL_INFOS[key];
    if (key === ACTIONSTYPE.Edit) {
      boundGlobalActions.showModal(localModalTypes.COUPON_FORM_MODAL, {
        baseUrl: urls.get('estoreBaseUrl'),
        imgBaseUrl: urls.get('imgBaseUrl'),
        store_id: estoreInfo.id,
        currency_symbol: estoreInfo.currency_symbol,
        coupon_id,
        customer_id: userInfo.get('uidPk'),
        callBackFn: () => getList(),
      });
      return;
    }
    modalAction(modalInfo, callBack);
  };
  let tableProps = {
    className: 'couponListTable',
    data: viewList[couponType],
    columns: getTableColumns(couponType, onOperateCoupon),
    rowKey: 'order_number',
  };
  return (
    <div className="coupon">
      <div className="comonFlex header">
        <div className="title">Coupon</div>
        <div className="comonFlex headerBtn" onClick={() => onOperateCoupon(ACTIONSTYPE.Edit)}>
          + Add Coupon
        </div>
      </div>
      <div className="contentBox">
        <div className="comonFlex contentHeader">
          {couponTypeList.map(item => (
            <div
              key={item}
              className={couponType === item ? 'comonFlex chBtnList active' : 'comonFlex chBtnList'}
              onClick={() => onSelectType(item)}
            >
              {item}({viewList[item] && viewList[item].length})
            </div>
          ))}
        </div>
        <div className="content">
          {viewList[couponType] && viewList[couponType].length > 0 && <Table {...tableProps} />}
          {(!viewList[couponType] || viewList[couponType].length === 0) && (
            <div className="emptyList">You have no {couponType.toLowerCase()} coupons!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CouponList);
