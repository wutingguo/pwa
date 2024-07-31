import XButton from 'appsCommon/components/dom/XButton';
import React, { memo, useEffect, useState } from 'react';

import tipsPng from '@resource/static/icons/handleIcon/tips.png';

import AlertTip from '@common/components/AlertTip';

import { verifyMinimumAmount } from '@apps/gallery-client/services/payment';

import ButtonWithLoginCheck from '../../../components/ButtonWithLoginCheck';
import shopCartService from '../../ShopCart/service';

import './index.scss';

const ShippingPayment = ({
  alertMessage,
  paypalButtonLoading,
  offlineButtonLoading,
  stripeButtonLoading,
  checkoutDisabled,
  paymentButtonDisabled,
  boundGlobalActions,
  boundProjectActions,
  isPaypalAlreadySetup,
  isStripeAlreadySetup,
  toOrderWithPaypal,
  isOfflineAlreadySetup,
  toOrderWithOffline,
  toOrderPage,
  currency,
  estoreBaseUrl,
  stripeButtonDisabled,
  price,
}) => {
  const [passStripe, setPassStripe] = useState(false);
  const { code } = currency;
  const { payable_amount } = price;

  useEffect(() => {
    // 如果是stripe 支付的话，需要校验stripe支付的最小金额
    if (isStripeAlreadySetup) {
      verifyMinimumAmount({
        baseUrl: estoreBaseUrl,
        currency: code,
        amount: payable_amount,
      }).then(res => {
        setPassStripe(res);
      });
    }
  }, [isStripeAlreadySetup, payable_amount]);

  const checkCoupon = async cb => {
    const { coupon } = await shopCartService.composeCartData({ estoreBaseUrl });
    if (coupon && !__isCN__) {
      const { valid, valid_code, minimum_amount } = coupon;
      if (!valid) {
        let errMsg = '';
        if (valid_code === 500864) {
          errMsg = "The coupon code doesn't exist or is invalid.";
        } else if (valid_code === 500865) {
          errMsg = 'The coupon code is expired.';
        } else if (valid_code === 500866) {
          errMsg = 'The coupon code is scheduled, not yet active.';
        } else if (valid_code === 500867) {
          const { symbol = '' } = currency || {};
          errMsg = `The coupon code requires minimum order amount of ${symbol}${minimum_amount}`;
        } else if (valid_code === 500868) {
          errMsg = 'The coupon code is not applicable to any items in the cart.';
        }
        boundGlobalActions.showConfirm({
          close: boundGlobalActions.hideConfirm,
          message: errMsg,
          buttons: [
            {
              text: 'OK',
              onClick: () => {
                location.reload();
              },
            },
          ],
        });
        return;
      }
    }
    cb();
  };

  if (checkoutDisabled) {
    return (
      <div className="print-store-shipping-payment">
        <div>
          <XButton className={`black cursor-not-allowed`} width={200} disabled={true}>
            {t('CHECKOUT_DISABLED')}
          </XButton>
          {!!alertMessage && <div className="alert-message">{alertMessage}</div>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`print-store-shipping-payment ${paypalButtonLoading ? 'cursor-not-allowed' : ''}`}
    >
      {isStripeAlreadySetup && (
        <div className="btnWrapper">
          <ButtonWithLoginCheck
            className="black"
            width={420}
            height={40}
            isWithLoading={true}
            isShowLoading={stripeButtonLoading}
            onClicked={() => checkCoupon(toOrderPage)}
            disabled={stripeButtonDisabled}
            boundGlobalActions={boundGlobalActions}
            boundProjectActions={boundProjectActions}
          >
            {t('TO_ORDER_WITH_STRIPE')}
          </ButtonWithLoginCheck>
          {!passStripe && (
            <AlertTip
              className="tooltip"
              message={t('FORBIDDEN_PAYMENT_TIPS', { amount: payable_amount })}
              icon={tipsPng}
              placement="left"
              maxWidth="250px"
            />
          )}
        </div>
      )}
      {isPaypalAlreadySetup && (
        <div className="btnWrapper">
          <ButtonWithLoginCheck
            className="black"
            width={420}
            height={40}
            isWithLoading={true}
            isShowLoading={paypalButtonLoading}
            onClicked={() => checkCoupon(toOrderWithPaypal)}
            disabled={paymentButtonDisabled}
            boundGlobalActions={boundGlobalActions}
            boundProjectActions={boundProjectActions}
          >
            {t('TO_ORDER_WITH_PAYPAL')}
          </ButtonWithLoginCheck>
          {Number(payable_amount) <= 0 && (
            <AlertTip
              className="tooltip"
              message={t('FORBIDDEN_PAYMENT_TIPS1')}
              icon={tipsPng}
              placement="left"
              maxWidth="250px"
            />
          )}
        </div>
      )}
      {isOfflineAlreadySetup && (
        <div className="btnWrapper">
          <ButtonWithLoginCheck
            className="black"
            width={420}
            height={40}
            isWithLoading={true}
            isShowLoading={offlineButtonLoading}
            onClicked={toOrderWithOffline}
            disabled={paymentButtonDisabled}
            boundGlobalActions={boundGlobalActions}
            boundProjectActions={boundProjectActions}
          >
            {t('CONTINUE_TO_ORDER_WITH_OFFLINE_PAYMENT')}
          </ButtonWithLoginCheck>
          {Number(payable_amount) <= 0 && (
            <AlertTip
              className="tooltip"
              message={t('FORBIDDEN_PAYMENT_TIPS1')}
              icon={tipsPng}
              placement="left"
              maxWidth="250px"
            />
          )}
        </div>
      )}
      {/* {!!alertMessage && <div className="alert-message">{alertMessage}</div>} */}
    </div>
  );
};

export default memo(ShippingPayment);
