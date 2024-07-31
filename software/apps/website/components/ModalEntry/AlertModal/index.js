import React, { memo } from 'react';

import { XModal } from '@common/components';

import './index.scss';

const AlertModal = props => {
  const { data } = props;
  const close = data.get('close');
  const message = data.get('message');

  return (
    <XModal
      className="website-alert-modal"
      opened
      onClosed={() => close()}
      escapeClose
      isHideIcon={false}
    >
      <div className="modal-title">Tips</div>
      <div className="modal-body">{message}</div>
    </XModal>
  );
};

export default memo(AlertModal);
