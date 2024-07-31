import React, { memo } from 'react';
import classnames from 'classnames';
import { getLanguageCode } from '@resource/lib/utils/language';

import { formatCurrency, needFormatCurrencyCountryMap } from '@resource/lib/utils/currency';
import './index.scss';

const Price = ({
  price,
  currency,
  countryCode,
  refreshPageData,
  isCheckout,
  isSubscribeProPlan = false,
  onSubscribeProPlanSuccess,
  additionalData
}) => {
  // const {
  //   showCreditButton,
  //   showCreditModal,
  //   showCouponCodeModal,
  //   showStudioSampleModal,
  //   showSubscribeToProPlanModal,
  //   showBillingProPlanModal
  // } = this.state;
  const showCreditButton = false;
  const { code, symbol } = currency;
  const { item_total, volume_discount, coupon_discount, applied_credits, total_money } = price;

  const couponPreFixSymbol = Number(coupon_discount) > 0 ? '-' : '';
  const creditPreFixSymbol = Number(applied_credits) > 0 ? '-' : '';
  let formatItemTotal = `${symbol}${item_total}`;
  let formatItemVolumeDiscount = volume_discount > 0 ? `${symbol}${volume_discount}` : '';
  let formatCouponDiscount = `${couponPreFixSymbol}${symbol}${coupon_discount}`;
  let formatTotalMoney = `${symbol}${total_money}`;
  let formatAppliedCredits = `${creditPreFixSymbol}${symbol}${applied_credits}`;
  let formatFee = isCheckout ? `${symbol}${additionalData.fee}` : '';
  let formatTax = isCheckout ? `${symbol}${additionalData.tax}` : '';
  let formatPayableAmount = isCheckout ? `${symbol}${additionalData.payable_amount}` : '';
  if (needFormatCurrencyCountryMap.includes(countryCode)) {
    formatItemTotal = formatCurrency(item_total);
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
      {!isCheckout && (
        <div className="subtotal-price-container">
          <span className='subtotal-text'>{t('SUBTOTAL')}:</span>
          <span className="subtotal-price">{formatTotalMoney}</span>
          {!__isCN__ && <span className="subtotal-price-code">{code}</span>}
        </div>
      )}
    </div>
  );
};

export default memo(Price);
