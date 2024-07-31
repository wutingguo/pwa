import React, { useState } from 'react';

import FInput from '@apps/live/components/FInput';
import { STYLE_MODAL } from '@apps/live/constants/modalTypes';

import { Container } from './layout';

export default function PhotoStyle(props) {
  const { boundGlobalActions, baseUrl, value = {}, onChange, baseInfo, disabled,callMethod } = props;

  function close() {
    boundGlobalActions.hideModal(STYLE_MODAL);
  }

  function onOk(data) {
    onChange && onChange(data);
    boundGlobalActions.hideModal(STYLE_MODAL);
    
  }
  function openModal() {
    if (disabled) return;
    const params = {
      close,
      onOk,
      boundGlobalActions,
      baseUrl,
      value,
      baseInfo,
      callMethod
    };
    boundGlobalActions.showModal(STYLE_MODAL, params);
  }

  return (
    <Container onClick={openModal} disabled={disabled}>
      {value.album_skin_name}
    </Container>
  );
}
