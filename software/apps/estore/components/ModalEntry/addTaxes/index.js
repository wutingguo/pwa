import React, { memo, useRef } from 'react';

import CommonModal from '../commonModal/index';
import TaxesForm from './TaxesForm';

import './index.scss';

const AddTaxesModal = props => {
  const { urls, data } = props;
  const close = data.get('close');
  const estoreInfo = data.get('estoreInfo');
  const afterOk = data.get('afterOk');
  const onError = data.get('onError');
  const formData = data.get('formData');
  const existCountryCodes = data.get('existCountryCodes');
  const existCountryDashSubRegionCodes = data.get('existCountryDashSubRegionCodes');
  const formRef = useRef();

  const onOk = async () => {
    try {
      const flag = formRef.current && (await formRef.current.submit());
      if (flag) {
        afterOk && afterOk();
        close();
      }
    } catch (e) {
      onError && onError();
    }
  };

  const modalProps = {
    okText: t('SAVE'),
    errInfo: '',
    onOk
  };

  return (
    <CommonModal className="store-modal-add-taxes" {...props} {...modalProps}>
      <div className="store-modal-add-taxes__container">
        <TaxesForm
          ref={formRef}
          data={formData?.toJS()}
          existCountryCodes={existCountryCodes?.toJS()}
          existCountryDashSubRegionCodes={existCountryDashSubRegionCodes?.toJS()}
        />
      </div>
    </CommonModal>
  );
};

export default memo(AddTaxesModal);
