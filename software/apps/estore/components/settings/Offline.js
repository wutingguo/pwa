import classnames from 'classnames';
import React, { memo, useCallback } from 'react';

import settingService from '../../constants/service/setting';

const Offline = ({
  refreshFullData,
  isAlreadySetup,
  boundGlobalActions,
  estoreBaseUrl,
  storeId,
}) => {
  const handleSetup = useCallback(() => {
    window.logEvent.addPageEvent({
      name: 'Estore_Settings_Offline_Click_Setup',
    });
    const cancelAndLog = () => {
      boundGlobalActions.hideConfirm();
    };
    const data = {
      title: t('OFFLINE_PAYMENT_SETUP'),
      className: 'store-settings-payment-method-confirm-modal',
      close: cancelAndLog,
      message: t('IF_YOU_OFFER_OFFLINE_PAYMENT'),
      buttons: [
        {
          className: 'white pwa-btn',
          text: t('CANCEL'),
          onClick: () => {
            window.logEvent.addPageEvent({
              name: 'Estore_Settings_OfflineSeutpPop_Click_Cancel',
            });
            boundGlobalActions.hideConfirm();
          },
        },
        {
          className: 'pwa-btn',
          text: t('CONTINUE1'),
          onClick: async () => {
            window.logEvent.addPageEvent({
              name: 'Estore_Settings_OfflineSetupPop_Click_Continue',
            });
            const res = await settingService.addPaymentMethod({
              baseUrl: estoreBaseUrl,
              storeId: storeId,
              paymentMethodCode: 'OFFLINE',
            });
            if (res?.ret_code === 200000) {
              boundGlobalActions.addNotification({
                message: t('OFFLINE_PAYMENT_SUCCESSFULLY_SETUP'),
                level: 'success',
                autoDismiss: 1,
              });
              refreshFullData();
            }
          },
        },
      ],
    };
    boundGlobalActions.showConfirm(data);
  }, [boundGlobalActions, refreshFullData, storeId, estoreBaseUrl]);

  const handleDisable = useCallback(() => {
    window.logEvent.addPageEvent({
      name: 'Estore_Settings_Offline_Click_Disable',
    });
    const cancelAndLog = () => {
      boundGlobalActions.hideConfirm();
    };
    const data = {
      title: t('OFFLINE_PAYMENT_SETUP'),
      className: 'store-settings-payment-method-confirm-modal',
      close: cancelAndLog,
      message: t('THE_OFFLINE_PAYMENT_IS_ENABLED'),
      buttons: [
        {
          className: 'white pwa-btn',
          text: t('CANCEL'),
          onClick: () => {
            window.logEvent.addPageEvent({
              name: 'Estore_Settings_OfflineDisablePop_Click_Cancel',
            });
            cancelAndLog();
          },
        },
        {
          className: 'pwa-btn',
          text: t('DISABLE'),
          onClick: async () => {
            window.logEvent.addPageEvent({
              name: 'Estore_Settings_OfflineDisablePop_Click_Disable',
            });
            await settingService.disablePaymentMethod({
              baseUrl: estoreBaseUrl,
              storeId: storeId,
              paymentMethod: 'OFFLINE',
            });

            boundGlobalActions.addNotification({
              message: t('OFFLINE_PAYMENT_SUCCESSFULLY_DISABLED'),
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
      <div className="store-settings-payment__method__text-logo-container">
        <div className={classnames('offline-logo', { ['size']: __isCN__ })}>{t('OFFLINE')}</div>
      </div>
      <p className="store-settings-payment__method__desc">{t('USE_OFFLINE_PAYMENT_METHOD')}</p>

      <button
        className={classnames('store-settings-payment__method__setup-button offline', {
          ['disconnect']: isAlreadySetup,
        })}
        onClick={isAlreadySetup ? handleDisable : handleSetup}
      >
        {isAlreadySetup ? t('DISABLE') : t('SETUP')}
      </button>
    </div>
  );
};

export default memo(Offline);
