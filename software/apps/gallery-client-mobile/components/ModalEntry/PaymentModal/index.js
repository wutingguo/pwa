import XButton from 'appsCommon/components/dom/XButton';
import React, { memo, useEffect, useState } from 'react';

import tipsPng from '@resource/static/icons/handleIcon/tips.png';

import { XModal, XRadio } from '@common/components';

import { verifyMinimumAmount } from '@apps/gallery-client/services/payment';

import './index.scss';

const PaymentModal = props => {
  const {
    isStripeAlreadySetup,
    isPaypalAlreadySetup,
    isOfflineAlreadySetup,
    stripeButtonDisabled,
    currency,
    price,
    toOrderPage,
    paypalButtonLoading,
    offlineButtonLoading,
    paymentButtonDisabled,
    boundGlobalActions,
    boundProjectActions,
    stripeButtonLoading,
    toOrderWithPaypal,
    estoreBaseUrl,
    toOrderWithOffline,
    onClose,
  } = props;
  const [paymentMethod, setPaymentMethod] = useState([
    { type: 1, name: 'Credit Card', isShow: isStripeAlreadySetup },
    { type: 2, name: 'PayPal', isShow: isPaypalAlreadySetup },
    { type: 3, name: 'Offline Payment', isShow: isOfflineAlreadySetup },
  ]);
  const [checkedType, setCheckedType] = useState(paymentMethod.find(item => item.isShow).type);

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
  const handleContinue = () => {
    if (checkedType === 1) {
      if (!passStripe) {
        boundGlobalActions.addNotification({
          message: t('FORBIDDEN_PAYMENT_TIPS', { amount: payable_amount }),
          level: 'error',
          autoDismiss: 3,
        });
      } else {
        toOrderPage();
      }
    }
    if (Number(payable_amount) <= 0) {
      boundGlobalActions.addNotification({
        message: t('FORBIDDEN_PAYMENT_TIPS1'),
        level: 'error',
        autoDismiss: 3,
      });
      onClose();
      return;
    }
    if (checkedType === 2) {
      toOrderWithPaypal();
    }
    if (checkedType === 3) {
      toOrderWithOffline();
    }
    onClose();
  };
  const modalProps = {
    className: 'payment-method-modal',
    isHideIcon: false,
    escapeClose: false,
  };
  return (
    <XModal {...modalProps} opened onClosed={onClose}>
      <div className="modal-title">Payment Method</div>
      {paymentMethod.map((item, index) => {
        const { isShow, type, name } = item;
        if (!isShow) {
          return null;
        }
        return (
          <div key={index} className={`payment-type-item ${type === checkedType ? 'active' : ''}`}>
            <XRadio
              checked={type === checkedType}
              text={name}
              value={type}
              onClicked={() => setCheckedType(type)}
            />
          </div>
        );
      })}
      <div className="modal-footer">
        <XButton
          className="black"
          width={250}
          height={60}
          isWithLoading={true}
          isShowLoading={stripeButtonLoading || paypalButtonLoading || offlineButtonLoading}
          onClicked={handleContinue}
          disabled={stripeButtonDisabled || paymentButtonDisabled || paymentButtonDisabled}
        >
          Continue
        </XButton>
      </div>
    </XModal>
  );
};

export default memo(PaymentModal);
