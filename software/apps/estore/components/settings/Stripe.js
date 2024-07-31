import classnames from 'classnames';
import React, { useCallback } from 'react';

import { SETUP_STRIPE_MODAL } from '@apps/estore/constants/modalTypes';

import settingService from '../../constants/service/setting';

import stripeImg from './assets/stripe.png';

const Stripe = ({
  refreshFullData,
  isAlreadySetup,
  boundGlobalActions,
  estoreBaseUrl,
  storeId,
}) => {
  const handleSetup = useCallback(() => {
    window.logEvent.addPageEvent({
      name: 'Estore_Settings_Stripe_Click_Setup',
    });
    boundGlobalActions.showModal(SETUP_STRIPE_MODAL, {
      title: t('ESTORE_SETUP_STRIPE'),
      close: () => {
        window.logEvent.addPageEvent({
          name: 'Estore_Settings_StripeSeutpPop_Click_Cancel',
        });
        boundGlobalActions.hideModal(SETUP_STRIPE_MODAL);
      },
      afterOk: () => {
        window.logEvent.addPageEvent({
          name: 'Estore_Settings_StripeSetupPop_Click_Apply',
        });
        boundGlobalActions.addNotification({
          message: `Stripe successfully setup.`,
          level: 'success',
          autoDismiss: 1,
        });
        refreshFullData();
      },
      onError: (err = 'Invalid API credentials') => {
        boundGlobalActions.addNotification({
          message: err,
          level: 'error',
          autoDismiss: 2,
        });
      },
    });
  }, [boundGlobalActions, refreshFullData]);

  const handleDisconnect = useCallback(() => {
    window.logEvent.addPageEvent({
      name: 'Estore_Settings_Stripe_Click_Disconnect',
    });
    const cancelAndLog = () => {
      window.logEvent.addPageEvent({
        name: 'Estore_Settings_StripeDisconnectPop_Click_Cancel',
      });
      boundGlobalActions.hideConfirm();
    };
    const data = {
      title: 'Stripe Setup',
      className: 'store-settings-payment-method-confirm-modal',
      close: cancelAndLog,
      message: t('Your Stripe account is connected. Do you wish to continue?'),
      buttons: [
        {
          className: 'white pwa-btn',
          text: t('CANCEL'),
          onClick: cancelAndLog,
        },
        {
          className: 'pwa-btn',
          text: t('Disconnect'),
          onClick: async () => {
            window.logEvent.addPageEvent({
              name: 'Estore_Settings_StripeDisconnectPop_Click_Disconnect',
            });
            await settingService.disablePaymentMethod({
              baseUrl: estoreBaseUrl,
              storeId: storeId,
              paymentMethod: 'STRIPE',
            });

            boundGlobalActions.addNotification({
              message: `Stripe successfully disconnected.`,
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
        <img src={stripeImg} alt="method logo" />
      </div>
      <p className="store-settings-payment__method__desc">
        Stripe is a secure and quick way to accept credit cards on the web. By connecting Stripe,
        you will be able to accept payments immediately directly on your storefront. Stripe charges
        a processing fee of 2.9% + $0.30 for each transaction. This rate may vary based on your
        country.
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

export default Stripe;
