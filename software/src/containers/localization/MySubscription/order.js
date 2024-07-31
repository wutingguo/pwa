import classNames from 'classnames';
import Table from 'rc-table';
import React, { Fragment, useEffect, useMemo, useState } from 'react';

import XPagePagination from '@resource/components/XPagePagination';

import * as modalTypes from '@resource/lib/constants/modalTypes';
import {
  aiphotoDelicacyInfo,
  aiphotoInfoFields,
  aiphotoMTComboCodes,
} from '@resource/lib/constants/priceInfo';
import {
  aiphotoInfo,
  livePhotoInfo,
  saasProducts,
  unfiyFormatCodeToCN,
} from '@resource/lib/constants/strings';

import {
  getAIOrderList,
  getLicenseOrderList,
  onlyCancelOrder,
  postCancelSubscribeOrder,
} from '@resource/pwa/services/subscription';

import LoadingImg from '@common/components/LoadingImg';

import { getColumns } from './_handle';

import './order.scss';

const tabList = [
  { label: '订阅订单', tab: 0 },
  { label: '套餐订单', tab: 1 },
];

const OrderComp = props => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({ pageSize: 10, pageNum: 1, total: 10 });
  const [tableData, setTableData] = useState([]);
  const { showMyCoupon, userAuth, urls, boundGlobalActions, planList } = props;
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  const baseUrl = urls.get('baseUrl');

  const getOrderList = (page = 1) => {
    const { customerId } = userAuth;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const getListFn = currentTab === 0 ? getLicenseOrderList : getAIOrderList;
    setLoading(true);
    setTableData([]);
    getListFn({
      galleryBaseUrl,
      customerId,
      ...pageInfo,
      pageNum: page,
    }).then(res => {
      const { records = [], total } = res;
      setPageInfo({
        ...pageInfo,
        total,
        pageNum: page,
      });
      setLoading(false);
      setTableData(records || []);
    });
  };

  useEffect(() => {
    getOrderList();
  }, [currentTab]);

  const openPay = (productId, productVersion, orderNumber) => {
    window.logEvent.addPageEvent({
      name: 'MyOrder_Click_ToPay',
    });

    const { showModal, hideModal } = boundGlobalActions;
    const plans = planList.toJS();
    let curProduct = aiphotoInfo;
    let params = {};
    if (currentTab === 0) {
      curProduct = plans[productId];
      const curVersion = curProduct.find(
        item => item.level_name === unfiyFormatCodeToCN[productVersion]
      );
      params = {
        product_id: productId,
        level: curVersion.level_id,
        cycle: curVersion.cycle_id,
        continueOrderNumber: orderNumber,
        escapeClose: true,
        onClosed: () => {
          hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
          // boundGlobalActions.getMySubscription(galleryBaseUrl);
        },
      };
    } else if (productId === saasProducts.live) {
      const curVersion = livePhotoInfo.find(item => item.comboCode === productVersion);
      params = {
        product_id: productId,
        level: curVersion.level_id,
        cycle: curVersion.cycle_id,
        continueOrderNumber: orderNumber,
        liveParams: {
          ...curVersion,
          combos: livePhotoInfo.slice(1),
        },
        escapeClose: true,
        onClosed: () => {
          hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
        },
      };
    } else {
      let curVersion = aiphotoInfo.find(item => item.comboCode === productVersion);
      let combos = null;
      if (productVersion === 'ALBUM_EDIT_IMAGE_ONE') {
        curVersion = aiphotoInfoFields.find(item => item.comboCode === productVersion) || {};
        combos = aiphotoInfoFields;
        curVersion.subTab = 0; // 无数张快修subTab=0
      } else if (aiphotoMTComboCodes.indexOf(productVersion) !== -1) {
        curVersion = aiphotoDelicacyInfo.find(item => item.comboCode === productVersion) || {};
        combos = aiphotoDelicacyInfo;
        curVersion.subTab = 1; // 精修subTab=1
      }
      params = {
        product_id: productId,
        level: curVersion.level_id,
        cycle: curVersion.cycle_id,
        continueOrderNumber: orderNumber,
        aiphotoParams: {
          ...curVersion,
          combos: combos || aiphotoInfo.slice(1),
        },
        escapeClose: true,
        onClosed: () => {
          hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
        },
      };
    }
    showModal(modalTypes.SAAS_CHECKOUT_MODAL, params);
  };

  const commonCancel = () => {
    window.logEvent.addPageEvent({
      name: 'MyOrder_Click_Cancel',
    });

    const isLicense = currentTab === 0;
    const { customerId } = userAuth;

    const params = order_number => ({
      customer_uid: customerId,
      // subscribe_plan_scope: productId,
      order_number,
    });
    return isLicense
      ? (...arg) =>
          postCancelSubscribeOrder(params(...arg), galleryBaseUrl) // 订阅取消
            .then(res => {
              getOrderList();
            })
      : orderNumber =>
          onlyCancelOrder(baseUrl, customerId, orderNumber) // 修图取消
            .then(res => {
              getOrderList();
            });
  };

  const tableProps = useMemo(() => {
    const isLicense = currentTab === 0;
    const cancelOrder = commonCancel();
    return {
      className: 'order-detail-table',
      data: tableData,
      columns: getColumns(isLicense, cancelOrder, openPay),
      rowKey: 'order-item',
      tableLayout: 'fixed',
    };
  }, [currentTab, tableData]);

  const changeTab = tab => {
    setCurrentTab(tab);
    setPageInfo({ pageSize: 10, pageNum: 1, total: 10 });
  };

  const onChangeFilter = ({ value }) => {
    getOrderList(value);
  };

  const { total, pageNum, pageSize } = pageInfo;
  const totalPage = Math.ceil(total / pageSize);

  return (
    <Fragment>
      <div className="subscription-header">
        <div className="my-subscription-title section-title">
          {t('SUBSCRIPTION')}
          {' > '}
          {t('订单记录')}
        </div>
      </div>
      <div className="my-order-content">
        <div className="tabs">
          {tabList.map(({ label, tab }) => {
            const itemClass = classNames('item', { active: tab === currentTab });
            return (
              <div key={tab} className={itemClass} onClick={() => changeTab(tab)}>
                {label}
              </div>
            );
          })}
          <div className="coupon-back" onClick={() => showMyCoupon(false, 'isShowOrder')}>
            {t('BACK')}
          </div>
        </div>
        <div className="order-detail-container">
          {loading ? (
            <LoadingImg />
          ) : !tableData.length ? (
            <div className="show-empty-content">暂无数据</div>
          ) : (
            <Table {...tableProps} scroll={{ x: 1700 }} />
          )}
          {total > 10 ? (
            <div className="pagenation-container">
              <XPagePagination
                currentPage={pageNum}
                totalPage={totalPage}
                changeFilter={onChangeFilter}
              />
            </div>
          ) : null}
        </div>
      </div>
    </Fragment>
  );
};

export default OrderComp;
