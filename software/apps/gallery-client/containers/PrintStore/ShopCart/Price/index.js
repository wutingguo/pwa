import classnames from 'classnames';
import React, { memo } from 'react';

import { formatCurrency, needFormatCurrencyCountryMap } from '@resource/lib/utils/currency';
import { getLanguageCode } from '@resource/lib/utils/language';

import ApplyCoupon from '@common/components/ApplyCoupon';

import './index.scss';

const Price = ({
  price,
  currency,
  countryCode,
  isCheckout,
  additionalData,
  baseUrl,
  refreshCart,
  coupon,
}) => {
  const showCreditButton = false;
  const { code, symbol } = currency;
  const {
    item_total,
    volume_discount,
    coupon_discount,
    applied_credits,
    total_money,
    item_discount,
  } = price;

  const couponPreFixSymbol = Number(coupon_discount) > 0 ? '-' : '';
  const creditPreFixSymbol = Number(applied_credits) > 0 ? '-' : '';
  const shoppingCartPriceDetailCls = classnames('shopping-cart-price-detail', {
    'shopping-cart-price-detail-de': getLanguageCode() === 'de',
  });

  let formatItemTotal = `${symbol}${item_total}`;
  let formatCouponCount = `${symbol}${item_discount}`;
  let formatItemVolumeDiscount = volume_discount > 0 ? `${symbol}${volume_discount}` : '';
  let formatCouponDiscount = `${couponPreFixSymbol}${symbol}${coupon_discount}`;
  let formatTotalMoney = `${symbol}${total_money}`;
  let formatAppliedCredits = `${creditPreFixSymbol}${symbol}${applied_credits}`;
  let formatFee = isCheckout ? `${symbol}${additionalData.fee}` : '';
  let formatTax = isCheckout ? `${symbol}${additionalData.tax}` : '';
  let formatPayableAmount = isCheckout ? `${symbol}${additionalData.payable_amount}` : '';
  if (needFormatCurrencyCountryMap.includes(countryCode)) {
    formatItemTotal = formatCurrency(item_total);
    formatCouponCount = formatCurrency(item_discount);
    formatItemVolumeDiscount = volume_discount > 0 ? formatCurrency(volume_discount) : '';
    formatCouponDiscount = `${couponPreFixSymbol} ${formatCurrency(coupon_discount)}`;
    formatTotalMoney = formatCurrency(total_money);
    formatAppliedCredits = showCreditButton
      ? `${couponPreFixSymbol} ${formatCurrency(applied_credits)}`
      : '';
    formatFee = isCheckout ? formatCurrency(additionalData.fee) : '';
    formatTax = isCheckout ? formatCurrency(additionalData.tax) : '';
    formatPayableAmount = isCheckout ? formatCurrency(additionalData.payable_amount) : '';
  }

  return (
    <div className="shopping-cart-price-section">
      <div className={shoppingCartPriceDetailCls}>
        <ul>
          <li>
            <div className="price-left">{t('ITEMS_TOTAL')}:</div>
            <div className="price-right">{formatItemTotal}</div>
          </li>
          {!__isCN__ && (
            <li className="coupon_applied_wrapper">
              <div className="price-left">
                <ApplyCoupon baseUrl={baseUrl} refreshCart={refreshCart} coupon={coupon} />
              </div>
              <div className="price-right">-{formatCouponCount}</div>
            </li>
          )}
          {volume_discount > 0 && (
            <li>
              <div className="price-left">{t('VOLUME_DISCOUNT')}:</div>
              <div className="price-right">-{formatItemVolumeDiscount}</div>
            </li>
          )}
          {isCheckout && (
            <li>
              <div className="price-left">{t('CHECKOUT_PRICE_SHIPPINT')}:</div>
              <div className="price-right">{formatFee}</div>
            </li>
          )}
          {isCheckout && (
            <li>
              <div className="price-left">{t('CHECKOUT_PRICE_TAX')}:</div>
              <div className="price-right">{formatTax}</div>
            </li>
          )}
          {isCheckout && (
            <li className="shipping-total">
              <div className="price-left">{t('CHECKOUT_PRICE_TOTAL')}:</div>
              <div className="price-right">
                <span>{formatPayableAmount}</span>
                <span className="shipping-total-code">{code}</span>
              </div>
            </li>
          )}
        </ul>
      </div>

      {!isCheckout && (
        <div className="shopping-cart-price-summary">
          <div className="subtotal-price-container">
            <span>{t('SUBTOTAL')}:</span>
            <span className="subtotal-price">{formatTotalMoney}</span>
            {!__isCN__ && <span className="subtotal-price-code">{code}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Price);
