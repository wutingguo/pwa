import React from 'react';

import * as baseModalTypes from '@resource/lib/constants/modalTypes';
import * as localModalTypes from '@apps/gallery/constants/modalTypes';

import XUploadModal from '@resource/components/modals/XUploadModal';

import BaseModal from './BaseModal';
import ImageFocalModal from './ImageFocalModal';
import ChangeCoverModal from './ChangeCoverModal';
import CopyListModal from './CopyListModal';
import GetDirectLinkModal from './GetDirectLinkModal';
import ImageCopyMoveModal from './ImageCopyMoveModal';
import CreateAiModal from '@resource/components/modals/CreateAiModal';

import { getUploadModalParams } from './getParams';

export const getModals = that => {
  const { modals } = that.props;
  const modalsJSX = [];

  modals.forEach((modal, index) => {
    const { boundGlobalActions, boundProjectActions } = that.props;
    switch (modal.get('modalType')) {
      case baseModalTypes.UPLOAD_MODAL: {
        const uploadModalProps = getUploadModalParams(that, modal);
        modalsJSX.push(<XUploadModal {...uploadModalProps} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.NEW_COLLECTION_MODAL: {
        modalsJSX.push(<CreateAiModal data={modal} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.IMAGE_FOCAL_MODAL: {
        modalsJSX.push(<ImageFocalModal data={modal} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.CHANGE_COVER_MODAL: {
        modalsJSX.push(
          <ChangeCoverModal
            data={modal}
            key={modal.get('id')}
            boundProjectActions={boundProjectActions}
            boundGlobalActions={boundGlobalActions}
          />
        );
        break;
      }
      case localModalTypes.EDIT_MODAL: {
        modalsJSX.push(
          <CreateModal data={modal} key={modal.get('id')} boundGlobalActions={boundGlobalActions} />
        );
        break;
      }
      case localModalTypes.COPY_LIST_MODAL: {
        modalsJSX.push(
          <CopyListModal
            data={modal}
            key={modal.get('id')}
            boundGlobalActions={boundGlobalActions}
          />
        );
        break;
      }
      case localModalTypes.GET_DIRECT_LINK_MODAL: {
        modalsJSX.push(<GetDirectLinkModal data={modal} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.BASE_MODAL: {
        modalsJSX.push(
          <BaseModal data={modal} key={modal.get('id')} boundGlobalActions={boundGlobalActions} />
        );
        break;
      }
      case localModalTypes.IMAGE_COPY_MOVE_MODAL: {
        modalsJSX.push(
          <ImageCopyMoveModal
            data={modal}
            key={modal.get('id')}
            boundGlobalActions={boundGlobalActions}
          />
        );
        break;
      }
      default:
        break;
    }
  });

  return modalsJSX;
};
