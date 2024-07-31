import React from 'react';

import XUploadModal from '@resource/components/modals/XUploadModal';

import * as baseModalTypes from '@resource/lib/constants/modalTypes';

import * as localModalTypes from '@apps/theme-editor/constants/modalTypes';

import BaseModal from './BaseModal';
import ProgressModal from './ProgressModal';
import { getUploadModalParams } from './getParams';

export const getModals = that => {
  const { modals, urls, boundGlobalActions, boundProjectActions, userInfo, pageArray } = that.props;

  const modalsJSX = [];

  modals.forEach((modal, index) => {
    switch (modal.get('modalType')) {
      case baseModalTypes.UPLOAD_MODAL: {
        const uploadModalProps = getUploadModalParams(that, modal);
        modalsJSX.push(<XUploadModal {...uploadModalProps} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.BASE_MODAL: {
        modalsJSX.push(
          <BaseModal data={modal} key={modal.get('id')} boundGlobalActions={boundGlobalActions} />
        );
        break;
      }
      case localModalTypes.PROGERSS_MODAL: {
        const modalProps = {
          key: modal.get('id'),
          isShown: true,
          onCloseModal: () => {
            boundGlobalActions.hideModal(localModalTypes.PROGERSS_MODAL);
          },
          boundProjectActions,
          boundGlobalActions,
          pageArray,
        };
        modalsJSX.push(<ProgressModal {...modalProps} />);
        break;
      }
      default:
        break;
    }
  });
  return modalsJSX;
};
