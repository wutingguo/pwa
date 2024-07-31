import React, { memo, useEffect, useRef, useState } from 'react';

import { Input } from '@resource/components/XInput';
import { RcRadioGroup } from '@resource/components/XRadio';

import { NAME_REG } from '@resource/lib/constants/reg';

import Select from '@common/components/Select';

import estoreService from '../../../constants/service';
import CommonModal from '../commonModal/index';

import PaypalSetupForm from './Form';

import './index.scss';

const SetupPaypalModal = props => {
  const { urls, data } = props;
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
      onError && onError();
    }
  };

  const modalProps = {
    errInfo: '',
    onOk,
    cancelText: t('ESTORE_SETUP_PAYPAL_CANCEL'),
    okText: t('ESTORE_SETUP_PAYPAL_APPLY'),
  };

  return (
    <CommonModal className="store-modal-setup-paypal" {...props} {...modalProps}>
      <div className="store-modal-setup-paypal__container">
        <div className="store-modal-setup-paypal__container__desc">
          <span>{t('ESTORE_SETUP_PAYPAL_DESC')}</span>
          <a
            className="link"
            target="_blank"
            href="https://help.zno.com/hc/en-us/articles/23889173490839-How-to-Set-Up-PayPal-Payment-in-Zno-Estore"
            onClick={() => {
              window.logEvent.addPageEvent({
                name: 'Estore_Settings_PayPalSetupPop_Click_WhereAPICredentials',
              });
            }}
          >
            {t('ESTORE_SETUP_PAYPAL_DESC_LINK')}
          </a>
        </div>
        <PaypalSetupForm ref={formRef} />
        <div className="store-modal-setup-paypal__container__tips">
          <a
            className="link"
            target="_blank"
            href="https://www.paypal.com/cgi-bin/webscr?cmd=_get-api-signature&generic-flow=true"
            onClick={() => {
              window.logEvent.addPageEvent({
                name: 'Estore_Settings_PayPalSetupPop_Click_RetrieveCredentials',
              });
            }}
          >
            {t('ESTORE_SETUP_PAYPAL_TIPS_LINK')}
          </a>
        </div>
      </div>
    </CommonModal>
  );
};

export default memo(SetupPaypalModal);
