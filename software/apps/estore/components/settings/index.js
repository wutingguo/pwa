import classnames from 'classnames';
import React, { memo, useCallback, useEffect, useMemo } from 'react';

import HeaderLayout from '../common/HeaderLayout';

import Offline from './Offline';
import Paypal from './Paypal';
import Stripe from './Stripe';

import './index.scss';

const Settings = ({ boundGlobalActions, estoreInfo, urls }) => {
  const estoreBaseUrl = urls.get('estoreBaseUrl');
  const storeId = estoreInfo?.id;
  const { currency_code, currency_symbol, country_name } = estoreInfo || {};
  const { isPaypalAlreadySetup = false, isOfflineAlreadySetup = false } = useMemo(() => {
    const { payment_methods = [] } = estoreInfo;
    console.log('payment_methods', payment_methods);
    const isPaypalAlreadySetup = payment_methods.some(m => m.payment_method === 'PAYPAL');
    const isOfflineAlreadySetup = payment_methods.some(m => m.payment_method === 'OFFLINE');
    return {
      isPaypalAlreadySetup,
      isOfflineAlreadySetup,
    };
  }, [estoreInfo]);

  const { isStripeAlreadySetup } = useMemo(() => {
    const { payment_methods = [] } = estoreInfo;
    const isStripeAlreadySetup = payment_methods.some(m => m.payment_method === 'STRIPE');
    return {
      isStripeAlreadySetup,
    };
  }, [estoreInfo]);

  const refreshFullData = useCallback(async () => {
    boundGlobalActions.getEstoreInfo();
  }, [boundGlobalActions]);

  return (
    <div className="store-settings">
      <HeaderLayout title={t('SETTINGS')} />

      <section className="store-settings-payment">
        <h2 className="store-settings-payment__title">{t('PAYMENT')}</h2>
        <p className="store-settings-payment__sub-title">{t('PAYMENTS_ARE_ACCEPTED')}</p>

        {!__isCN__ && (
          <Stripe
            refreshFullData={refreshFullData}
            isAlreadySetup={isStripeAlreadySetup}
            estoreBaseUrl={estoreBaseUrl}
            storeId={storeId}
            boundGlobalActions={boundGlobalActions}
          />
        )}

        {!__isCN__ && (
          <Paypal
            refreshFullData={refreshFullData}
            isAlreadySetup={isPaypalAlreadySetup}
            estoreBaseUrl={estoreBaseUrl}
            storeId={storeId}
            boundGlobalActions={boundGlobalActions}
          />
        )}

        <Offline
          refreshFullData={refreshFullData}
          isAlreadySetup={isOfflineAlreadySetup}
          estoreBaseUrl={estoreBaseUrl}
          storeId={storeId}
          boundGlobalActions={boundGlobalActions}
        />
      </section>
      {!__isCN__ && (
        <section className="store-settings-currency">
          <h2 className="store-settings-currency__title">Store Currency</h2>
          <span className="store-settings-currency__value">{`${country_name} (${currency_code})`}</span>
          <span className="store-settings-currency__tips">
            Your store currency is determined by your account currency.
          </span>
        </section>
      )}
    </div>
  );
};

export default memo(Settings);
