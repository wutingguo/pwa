import React, { useState, useEffect, memo, useRef } from 'react';
import { RcRadioGroup } from '@resource/components/XRadio';
import Select from '@common/components/Select';
import { Input } from '@resource/components/XInput';
import { NAME_REG } from '@resource/lib/constants/reg';
import estoreService from '../../../constants/service';

import CommonModal from '../commonModal/index';

import './index.scss';
import TaxesForm from './TaxesForm';

const AddTaxesModal = props => {
  const { urls, data } = props;
  const baseUrl = urls.get('estoreBaseUrl');
  const close = data.get('close');
  const onLogMarkAsShipped = data.get('onLogMarkAsShipped');
  const estoreInfo = data.get('estoreInfo');
  const getEstoreDetail = data.get('getEstoreDetail');
  const afterOk = data.get('afterOk');
  const formRef = useRef();
  const order_no = data.getIn(['data', 'order_no']);
  const title = data.getIn(['data', 'title']);

  const onOk = async () => {
    formRef.current && (await formRef.current.submit());
    // close();
    // afterOk && afterOk();
  };

  const modalProps = {
    errInfo: '',
    onOk,
    close
  };
  const formProps = {
    order_no,
    getEstoreDetail,
    title,
    close,
    onLogMarkAsShipped
  };

  return (
    <CommonModal className="store-modal-add-taxes" {...props} {...modalProps}>
      <div className="store-modal-add-taxes__container">
        <TaxesForm ref={formRef} {...formProps} />
      </div>
    </CommonModal>
  );
};

export default memo(AddTaxesModal);
