import React from 'react';

import * as baseModalTypes from '@resource/lib/constants/modalTypes';

import * as localModalTypes from '@src/constants/modalTypes';

import PayFormModal from './PayFormModal';

export const getModals = that => {
  const { modals } = that.props;
  const modalsJSX = [];

  modals.forEach((modal, index) => {
    switch (modal.get('modalType')) {
      case localModalTypes.PAY_FORM_MODAL: {
        modalsJSX.push(<PayFormModal data={modal} key={modal.get('id')} />);
        break;
      }
      default:
        break;
    }
  });

  return modalsJSX;
};
