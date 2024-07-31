import React, { memo } from 'react';

import CommonModal from '../commonModal/index';

import './index.scss';

const DiscountModal = props => {
  const { data } = props;
  const items = data.get('items').toJS();
  const order_price = data.get('order_price').toJS();
  const currency = data.get('currency').toJS();
  const { sku_discount, apply_coupon_code } = order_price;
  const { symbol = '$' } = currency;
  const content = items.reduce((res, item) => {
    const { item_sku } = item;
    if (item_sku) {
      item_sku.forEach(_item => {
        res.push({
          label: _item.display_name,
          value: _item.total_sku_discount,
        });
      });
    }
    return res;
  }, []);

  const modalProps = {
    hideBtnList: true,
  };

  return (
    <CommonModal className="estore_discount" {...props} {...modalProps}>
      <div className="item_list">
        <div className="es_cost_title">
          <span>Item</span>
          <span>Coupon Code: {apply_coupon_code}</span>
        </div>
        <div className="content_wrapper">
          {content.map(item => (
            <div className="es_cost_content" key={item.label}>
              <span style={{ maxWidth: '80%' }}>{item.label}</span>
              <span>-{symbol + item.value}</span>
            </div>
          ))}
        </div>
        <div className="es_cost_total">
          <span>{t('CHECKOUT_PRICE_TOTAL', 'Total')}</span>
          &nbsp;&nbsp;
          <span className="bold">
            -{symbol}
            {((sku_discount * 100) / 100).toFixed(2)}
          </span>
        </div>
      </div>
    </CommonModal>
  );
};

export default memo(DiscountModal);
