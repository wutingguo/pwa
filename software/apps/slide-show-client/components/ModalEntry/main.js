import React from 'react';

import * as baseModalTypes from '@resource/lib/constants/modalTypes';
import * as localModalTypes from '@apps/slide-show-client/constants/modalTypes';

import BindEmailModal from './BindEmailModal';
import ViewFavoriteListModal from './ViewFavoriteListModal';
import DownloadMsginfoModal from './DownloadMsginfoModal';
import CheckzDownloadPin from './CheckzDownloadPin';
export const getModals = that => {
  const { modals } = that.props;
  const modalsJSX = [];

  modals.forEach((modal, index) => {
    const { boundGlobalActions, boundProjectActions, favoriteImageList } = that.props;
    switch (modal.get('modalType')) {
      case localModalTypes.BIND_EMAIL_MODAL: {
        modalsJSX.push(<BindEmailModal data={modal} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.VIEW_FAVORITE_LIST_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          favoriteImageList,
          boundGlobalActions,
          boundProjectActions
        };
        modalsJSX.push(<ViewFavoriteListModal {...props} />);
        break;
      }
      case localModalTypes.DOWN_LOAD_MSGINFO_MODAL: {
        modalsJSX.push(<DownloadMsginfoModal data={modal} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.CHECK_DOWNLOAD_PIN: {
        modalsJSX.push(<CheckzDownloadPin data={modal} key={modal.get('id')} />);
        break;
      }
      default:
        break;
    }
  });

  return modalsJSX;
};
