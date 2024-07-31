import classnames from 'classnames';
import React, { memo, useCallback } from 'react';

import { SETUP_PAYPAL_MODAL } from '@apps/estore/constants/modalTypes';

import settingService from '../../constants/service/setting';

import paypalImg from './assets/paypal.png';

const Paypal = ({
  refreshFullData,
  isAlreadySetup,
  boundGlobalActions,
  estoreBaseUrl,
  storeId,
}) => {
  const handleSetup = useCallback(() => {
    window.logEvent.addPageEvent({
      name: 'Estore_Settings_PayPal_Click_Setup',
    });
    boundGlobalActions.showModal(SETUP_PAYPAL_MODAL, {
      title: t('ESTORE_SETUP_PAYPAL'),
      close: () => {
        window.logEvent.addPageEvent({
          name: 'Estore_Settings_PayPalSeutpPop_Click_Cancel',
        });
        boundGlobalActions.hideModal(SETUP_PAYPAL_MODAL);
      },
      afterOk: () => {
        window.logEvent.addPageEvent({
          name: 'Estore_Settings_PayPalSetupPop_Click_Apply',
        });
        boundGlobalActions.addNotification({
          message: `Paypal successfully setup.`,
          level: 'success',
          autoDismiss: 1,
        });
        refreshFullData();
      },
      onError: () => {
        boundGlobalActions.addNotification({
          message: `Invalid API credentials`,
          level: 'error',
          autoDismiss: 2,
        });
      },
    });
  }, [boundGlobalActions, refreshFullData]);

  const handleDisconnect = useCallback(() => {
    window.logEvent.addPageEvent({
      name: 'Estore_Settings_PayPal_Click_Disconnect',
    });
    const cancelAndLog = () => {
      boundGlobalActions.hideConfirm();
    };
    const data = {
      title: 'Paypal Setup',
      className: 'store-settings-payment-method-confirm-modal',
      close: cancelAndLog,
      message: t('Your Paypal account is connected. Do you wish to continue?'),
      buttons: [
        {
          className: 'white pwa-btn',
          text: t('CANCEL'),
          onClick: () => {
            window.logEvent.addPageEvent({
              name: 'Estore_Settings_PayPalDisconnectPop_Click_Cancel',
            });
            boundGlobalActions.hideConfirm();
          },
        },
        {
          className: 'pwa-btn',
          text: t('Disconnect'),
          onClick: async () => {
            window.logEvent.addPageEvent({
              name: 'Estore_Settings_PayPalDisconnectPop_Click_Disconnect',
            });
            await settingService.disablePaymentMethod({
              baseUrl: estoreBaseUrl,
              storeId: storeId,
              paymentMethod: 'PAYPAL',
            });

            boundGlobalActions.addNotification({
              message: `Paypal successfully disconnected.`,
              level: 'success',
              autoDismiss: 1,
            });

            refreshFullData();
          },
        },
      ],
    };
    boundGlobalActions.showConfirm(data);
  }, [estoreBaseUrl, storeId, refreshFullData]);

  return (
    <div className="store-settings-payment__method">
      <div className="store-settings-payment__method__img-container">
        <img src={paypalImg} alt="method logo" />
      </div>
      <p className="store-settings-payment__method__desc">
        Allow your clients to pay with their PayPal accounts, or credit cards online. Rate ranges
        from 2.2%-2.9% + 30c. A PayPal business account is required to enable PayPal Express
        Checkout.
      </p>

      <button
        className={classnames('store-settings-payment__method__setup-button paypal', {
          ['disconnect']: isAlreadySetup,
        })}
        onClick={isAlreadySetup ? handleDisconnect : handleSetup}
      >
        {isAlreadySetup ? 'Disconnect' : 'Setup'}
      </button>
    </div>
  );
};

export default memo(Paypal);
