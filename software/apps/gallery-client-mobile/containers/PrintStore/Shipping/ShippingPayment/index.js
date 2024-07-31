import XButton from 'appsCommon/components/dom/XButton';
import React, { memo, useEffect, useState } from 'react';

import * as localModalTypes from '@apps/gallery-client-mobile/constants/modalTypes';

import ButtonWithLoginCheck from '../../../../components/ButtonWithLoginCheck';
import shopCartService from '../../ShopCart/service';

import './index.scss';

const ShippingPayment = props => {
  const {
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
  } = props;

  const handleOpenPaymentModal = async () => {
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
    boundGlobalActions.showModal(localModalTypes.PAYMENT_METHODS_MODAL, {
      onClose: () => {
        boundGlobalActions.hideModal(localModalTypes.PAYMENT_METHODS_MODAL);
      },
      ...props,
    });
  };
  if (checkoutDisabled) {
    return (
      <div className="print-store-shipping-payment">
        <div>
          <XButton className={`black cursor-not-allowed`} width={686} height={88} disabled={true}>
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
      <div className="btnWrapper">
        <ButtonWithLoginCheck
          className="black"
          width={686}
          height={88}
          isWithLoading={true}
          onClicked={handleOpenPaymentModal}
          boundGlobalActions={boundGlobalActions}
          boundProjectActions={boundProjectActions}
        >
          Continue to Order
        </ButtonWithLoginCheck>
      </div>
      {/* {!!alertMessage && <div className="alert-message">{alertMessage}</div>} */}
    </div>
  );
};

export default memo(ShippingPayment);
