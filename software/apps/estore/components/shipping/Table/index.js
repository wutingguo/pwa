import React, { memo, useCallback, useEffect, useState } from 'react';

import deletPng from '@resource/static/icons/handleIcon/delet.png';
import editorPng from '@resource/static/icons/handleIcon/editor.png';

import { SETUP_SHIPPING_MODAL } from '@apps/estore/constants/modalTypes';

import shippingService from '../../../constants/service/shipping';

import './index.scss';

function Table({ tableData = [], boundGlobalActions, estoreInfo, estoreBaseUrl, afterEdit }) {
  const { currency_code, currency_symbol, country_name } = estoreInfo || {};
  const handleClickEdit = useCallback(
    item => {
      const shippingData = tableData.find(data => data.id == item.target.id);
      boundGlobalActions.showModal(SETUP_SHIPPING_MODAL, {
        // title: t('EDIT_TAX_RATE'),
        close: () => boundGlobalActions.hideModal(SETUP_SHIPPING_MODAL),
        estoreInfo,
        estoreBaseUrl,
        shippingData,
        confirm: async obj => {
          const data = await shippingService.updateShipping(obj);
          if (data && data.ret_code == 200000) {
            // 关闭弹窗
            boundGlobalActions.hideModal(SETUP_SHIPPING_MODAL);
            afterEdit && afterEdit();
          }
        },
      });
      window.logEvent.addPageEvent({
        name: 'Estore_Shipping_Click_EditShippingMethod',
      });
    },
    [afterEdit]
  );

  const handleClickDelete = useCallback(
    async item => {
      const shippingData = tableData.find(data => data.id == item.target.id);
      const obj = {
        baseUrl: estoreBaseUrl,
        shipping_method_id: shippingData.id,
      };
      const { hideConfirm, showConfirm, addNotification } = boundGlobalActions;
      const message = t('DELETE_THIS_SHIPPING_METHOD');
      const cancelAndLog = () => {
        hideConfirm();
      };
      const messageData = {
        close: cancelAndLog,
        message: <div style={{ fontSize: 14 }}>{message}</div>,
        buttons: [
          {
            className: 'white pwa-btn',
            text: t('CANCEL'),
            onClick: () => {
              window.logEvent.addPageEvent({
                name: 'Estore_Shipping_DeleteShippingMethod_Click_Cancel',
              });
              cancelAndLog();
            },
          },
          {
            className: 'pwa-btn',
            text: t('DELETE'),
            onClick: async () => {
              const data = await shippingService.deleteShipping(obj);
              if (data && data.ret_code == 200000) {
                addNotification({
                  message: t('SUCCESSFULLY_DELETED'),
                  level: 'success',
                  autoDismiss: 3,
                });
                afterEdit && afterEdit();
              }
              window.logEvent.addPageEvent({
                name: 'Estore_Shipping_DeleteShippingMethod_Click_Delete',
              });
            },
          },
        ],
      };
      showConfirm(messageData);
      window.logEvent.addPageEvent({
        name: 'Estore_Shipping_Click_DeleteShippingMethod',
      });
    },
    [afterEdit]
  );

  return (
    <div className="store-shipping-table">
      <div className="store-shipping-title">{t('STORE_SHIPPING_TITLE')}</div>
      <div className="store-shipping-table__header row">
        <div className="store-shipping-table__header-cell col-1">{t('SHIPPING_METHOD')}</div>
        <div className="store-shipping-table__header-cell col-2">
          {__isCN__ ? '订单基础运费' : 'Fee per order'}
        </div>
        <div className="store-shipping-table__header-cell col-3">{t('SHIPS_TO')}</div>
        <div className="store-shipping-table__header-cell col-4">{t('ACTIONS')}</div>
      </div>
      {tableData.map(item => (
        <div className="store-shipping-table__item row" key={item.id}>
          <div className="store-shipping-table__item-cell col-1">{item.ship_method_name}</div>
          <div className="store-shipping-table__item-cell col-2">
            {__isCN__ ? '￥' : currency_symbol} {item.shipping_fee}
          </div>
          <div className="store-shipping-table__item-cell col-3">{item.region_name}</div>
          <div className="store-shipping-table__item-cell col-4">
            <div className="icons">
              <img id={item.id} src={editorPng} onClick={handleClickEdit} />
              <img id={item.id} src={deletPng} onClick={handleClickDelete} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default memo(Table);
