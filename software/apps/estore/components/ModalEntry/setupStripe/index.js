import React, { memo, useRef } from 'react';

import CommonModal from '../commonModal/index';

import StripeSetupForm from './Form';

import './index.scss';

const SetupStripeModal = props => {
  const { urls, data, boundGlobalActions } = props;
  const baseUrl = urls.get('estoreBaseUrl');
  const close = data.get('close');
  const estoreInfo = data.get('estoreInfo');
  const afterOk = data.get('afterOk');
  const onError = data.get('onError');
  const formRef = useRef();

  const onOk = async () => {
    try {
      formRef.current && (await formRef.current.submit());
      afterOk && afterOk();
      close();
    } catch (e) {
      onError && onError(e?.message);
    }
  };

  const modalProps = {
    errInfo: '',
    onOk,
    cancelText: t('ESTORE_SETUP_STRIPE_CANCEL'),
    okText: t('ESTORE_SETUP_STRIPE_APPLY'),
  };

  return (
    <CommonModal className="store-modal-setup-stripe" {...props} {...modalProps}>
      <div className="store-modal-setup-stripe__container">
        <div className="store-modal-setup-stripe__container__desc">
          <span>{t('ESTORE_SETUP_STRIPE_DESC')}</span>
          <a
            className="link"
            target="_blank"
            href="https://help.zno.com/hc/en-us/articles/23889109297431-How-to-Set-Up-Stripe-Payment-in-Zno-Estore"
            onClick={() => {
              window.logEvent.addPageEvent({
                name: 'Estore_Settings_StripeSetupPop_Click_WhereAPICredentials',
              });
            }}
          >
            {t('ESTORE_SETUP_STRIPE_DESC_LINK')}
          </a>
        </div>
        <StripeSetupForm ref={formRef} boundGlobalActions={boundGlobalActions} />
      </div>
    </CommonModal>
  );
};

export default memo(SetupStripeModal);
