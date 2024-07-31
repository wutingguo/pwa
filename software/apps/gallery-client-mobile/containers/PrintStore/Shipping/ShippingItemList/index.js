import React, { memo } from 'react';
import ShoppingCartItem from '../../../../components/ShoppingCartItem';
import './index.scss';

const ShippingItemList = ({ cart_items = [], currency, countryCode, isPureDigital }) => {
  if (!cart_items.length) return null;
  return (
    <div className="shipping-items-wrap-checkout ">
      <div className="shipping-header">
        <span className={`shipping-header-topic ${isPureDigital ? 'pureDigital' : ''}`}>
          {t('CHECKOUT_ITEM_LIST')}
        </span>
      </div>
      <div className="shipping-items-content">
        {cart_items.map(cartItem => {
          return (
            <ShoppingCartItem
              key={cartItem.item_id}
              className="shipping-cart-project-item-checkout"
              currency={currency}
              countryCode={countryCode}
              cartItem={cartItem}
              isShippingItem
            />
          );
        })}
      </div>
    </div>
  );
};

export default memo(ShippingItemList);
