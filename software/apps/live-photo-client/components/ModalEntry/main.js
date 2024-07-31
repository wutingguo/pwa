import React from 'react';

import * as localModalTypes from '@apps/live-photo-client/constants/modalTypes';

import ImageViewer from './ImageViewer';
import ShareQRCodeModal from './ShareQRCodeModal';
import WatermakTipModal from './WatermakTipModal';

export const getModals = that => {
  const { modals } = that.props;
  const modalsJSX = [];

  modals.forEach((modal, index) => {
    const { boundGlobalActions, boundProjectActions } = that.props;
    switch (modal.get('modalType')) {
      case localModalTypes.SHARE_QRCODE_MODAL: {
        modalsJSX.push(<ShareQRCodeModal data={modal} {...that.props} />);
        break;
      }
      case localModalTypes.IMAGE_VIEWER_MODAL: {
        modalsJSX.push(<ImageViewer data={modal} {...that.props} />);
        break;
      }
      case localModalTypes.WATERMARK_TIP_MODAL: {
        modalsJSX.push(<WatermakTipModal data={modal} {...that.props} />);
        break;
      }
      default:
        break;
    }
  });

  return modalsJSX;
};
