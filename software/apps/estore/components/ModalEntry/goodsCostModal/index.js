import React, { memo, useEffect, useRef, useState } from 'react';

import CommonModal from '../commonModal/index';

import './index.scss';

const GoodCostModal = props => {
  const { urls, data } = props;
  const close = data.get('close');
  const mixedExistedAuto = data.get('mixedExistedAuto');
  const order_price = data.get('order_price').toJS();
  const currency = data.get('currency').toJS();
  const ship_method_name = data.get('ship_method_name');
  const { sub_total, shipping, tax, total, estimate_cost, auto_shipping } = order_price;
  const { symbol = '$' } = currency;
  const formRef = useRef();
  const modalProps = {
    hideBtnList: true,
  };

  let shippingCost = shipping;
  if (mixedExistedAuto) {
    shippingCost = auto_shipping;
  }

  return (
    <CommonModal className="estore_cost" {...props} {...modalProps}>
      <div className="item_list">
        <div className="es_cost_title">
          <span>{__isCN__ ? '成本列表' : 'Item'}</span>
          <span>{t('ITEM_COST', 'Cost')}</span>
        </div>
        <div className="es_cost_content">
          <span>{t('GOODS_COST', 'Cost of Goods Sold')}</span>
          <span>{symbol + estimate_cost}</span>
        </div>
        <div className="es_cost_content">
          <span>
            {t('SHIPPING_GOODS', 'Shipping')} {ship_method_name ? `- ${ship_method_name}` : ''}
          </span>
          <span>{symbol + shippingCost}</span>
        </div>

        <div className="es_cost_total">
          <span>{t('CHECKOUT_PRICE_TOTAL', 'Total')}</span>
          &nbsp;
          <span className="bold">
            {((estimate_cost * 100 + shippingCost * 100) / 100).toFixed(2)}
          </span>
        </div>
      </div>
    </CommonModal>
  );
};

export default memo(GoodCostModal);
