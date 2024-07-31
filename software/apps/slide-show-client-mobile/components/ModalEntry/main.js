import React from 'react';

import * as baseModalTypes from '@resource/lib/constants/modalTypes';
import * as localModalTypes from '@apps/slide-show-client-mobile/constants/modalTypes';

export const getModals = that => {
  const { modals } = that.props;
  const modalsJSX = [];

  modals.forEach((modal, index) => {
    const { boundGlobalActions, boundProjectActions } = that.props;
    switch (modal.get('modalType')) {      
      default:
        break;
    }
  });

  return modalsJSX;
};
