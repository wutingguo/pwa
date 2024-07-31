import React, { Component, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { XModal, XButton } from '@common/components';
import alertImg from './alert.png';

import './index.scss';
import { useHistory } from 'react-router';

const PaymentFailedModal = ({ data }) => {
  const history = useHistory();
  const title = 'Your payment failed.';
  const subtitle = 'Go to the shopping cart and try again.';
  const tips =
    '*You might not have enough funds in your account to make the payment. Check your account balance or contact the payment provider.';
  const close = data.get('close');
  const onOk = data.get('onOk');
  const wrapClass = classNames('print-store-payment-failed-modal-wrap', data.get('className'));

  const handleClick = useCallback(() => {
    onOk();
  }, []);

  return (
    <XModal className={wrapClass} opened onClosed={close} escapeClose={false} isHideIcon={false}>
      <div className="modal-band-c">
        <img src={alertImg} />
      </div>
      <div className="modal-title-c">
        <div>{title}</div>
        <div>{subtitle}</div>
      </div>

      <div className="modal-body-c">{tips}</div>
      <div className="modal-footer-c clearfix">
        <XButton className="pwa-btn" onClicked={handleClick}>
          {t('SHOPPING_CART')}
        </XButton>
      </div>
    </XModal>
  );
};

export default memo(PaymentFailedModal);
