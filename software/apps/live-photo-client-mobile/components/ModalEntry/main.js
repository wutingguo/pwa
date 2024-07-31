import React from 'react';

import * as localModalTypes from '@apps/live-photo-client-mobile/constants/modalTypes';

import AvatarSearchDrawer from './AvatarSearchDrawer';
import ClauseDrawer from './ClauseDrawer';
import FormModal from './FormModal';
import ImageViewer from './ImageViewer';
import ShareQRCodeModal from './ShareQRCodeModal';
import UploadAIMappingDrawer from './UploadImage';
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
      case localModalTypes.UPLOAD_AI_MAPPING_DRAWER: {
        modalsJSX.push(<UploadAIMappingDrawer data={modal} {...that.props} />);
        break;
      }
      case localModalTypes.CLAUSE_DRAWER: {
        modalsJSX.push(<ClauseDrawer data={modal} {...that.props} />);
        break;
      }
      case localModalTypes.AVATAR_SEARCH_DRAWER: {
        modalsJSX.push(<AvatarSearchDrawer data={modal} {...that.props} />);
        break;
      }
      case localModalTypes.WATERMARK_TIP_MODAL: {
        modalsJSX.push(<WatermakTipModal data={modal} {...that.props} />);
        break;
      }
      case localModalTypes.CUSTOM_FORM_MODAL: {
        modalsJSX.push(<FormModal data={modal} {...that.props} />);
        break;
      }

      default:
        break;
    }
  });

  return modalsJSX;
};
