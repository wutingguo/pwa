import React from 'react';

import ChooseImgModal from '@resource/components/modals/ChooseImgModal';
import CreateAiModal from '@resource/components/modals/CreateAiModal';
import XUploadModal from '@resource/components/modals/XUploadModal';
import SaasGalleryUploader from '@resource/components/modals/app/SaasGalleryUploader';

import { SAAS_GALLERY_UPLOADER } from '@resource/lib/constants/componentIds';
import * as baseModalTypes from '@resource/lib/constants/modalTypes';

// import AIGroupsModal from './AIGroupsModal';
import { AIGroupsModal } from '@common/components/ModalEntry';

import { CreateModal, EditModal } from '@common/components';

import * as localModalTypes from '@apps/gallery/constants/modalTypes';

import AddPicRuleModal from './AddPicRuleModal';
import BaseModal from './BaseModal';
import ChangeCoverModal from './ChangeCoverModal';
import CollectionPresetModal from './CollectionPresetModal';
import CopyListModal from './CopyListModal';
import CreatWatemarkModal from './CreatWatemarkModal';
import EMAIL_TEMPLATE_INPUT from './EMAIL_TEMPLATE_INPUT';
import ExportAiGroupPhotoModal from './ExportAiGroupPhotoModal';
import GalleryAddSlideshowModal from './GalleryAddSlideshowModal';
import GetDirectLinkCNModal from './GetDirectLinkCNModal';
import GetDirectLinkModal from './GetDirectLinkModal';
import ImageCopyMoveModal from './ImageCopyMoveModal';
import ImageFocalModal from './ImageFocalModal';
import ManageClientsModal from './ManageClientsModal';
import VideoViewerModal from './VideoViewerModal';
import WATER_MARK_UPGRADE from './WATER_MARK_UPGRADE';
import { getAddVideoModalParams, getOldUploadModalParams, getUploadModalParams } from './getParams';

export const getModals = that => {
  const { modals } = that.props;
  const modalsJSX = [];

  modals.forEach((modal, index) => {
    const {
      boundGlobalActions,
      boundProjectActions,
      mySubscription,
      urls,
      userAuth = {},
    } = that.props;
    switch (modal.get('modalType')) {
      case baseModalTypes.UPLOAD_MODAL: {
        const grayInfo = modal.get('grayInfo');
        const media_type = modal.get('media_type');
        const triggerGray = !grayInfo.find(item => item.get('grayTag') === SAAS_GALLERY_UPLOADER);
        if (media_type === 3) {
          const uploadVideoModalProps = getAddVideoModalParams(that, modal);
          modalsJSX.push(<XUploadModal {...uploadVideoModalProps} key={modal.get('id')} />);
        } else if (triggerGray) {
          const uploadOldModalProps = getOldUploadModalParams(that, modal);
          modalsJSX.push(<XUploadModal {...uploadOldModalProps} key={modal.get('id')} />);
        } else {
          const uploadModalProps = getUploadModalParams(that, modal);
          modalsJSX.push(<SaasGalleryUploader {...uploadModalProps} key={modal.get('id')} />);
        }
        break;
      }
      case localModalTypes.NEW_COLLECTION_MODAL: {
        modalsJSX.push(<CreateModal data={modal} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.IMAGE_FOCAL_MODAL: {
        modalsJSX.push(<ImageFocalModal data={modal} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.CHANGE_COVER_MODAL: {
        const props = {
          boundProjectActions,
          boundGlobalActions,
          data: modal,
          key: modal.get('id'),
          ...that.props,
        };
        modalsJSX.push(<ChangeCoverModal {...props} />);
        break;
      }
      case localModalTypes.EDIT_MODAL: {
        modalsJSX.push(
          <EditModal data={modal} key={modal.get('id')} boundGlobalActions={boundGlobalActions} />
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

      case localModalTypes.GET_DIRECT_LINK_CN_MODAL: {
        modalsJSX.push(<GetDirectLinkCNModal data={modal} key={modal.get('id')} />);
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
      case localModalTypes.AI_COLLECTION_MODAL: {
        modalsJSX.push(<CreateAiModal data={modal} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.UPLOAD_WATEMARK_MODAL: {
        const uploadWatemarkParams = modal.get('params');
        modalsJSX.push(<XUploadModal {...uploadWatemarkParams.toJS()} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.CREAT_WATEMARK_MODAL: {
        const creatWatemarkParams = modal.get('params');
        modalsJSX.push(
          <CreatWatemarkModal {...creatWatemarkParams.toJS()} key={modal.get('id')} />
        );
        break;
      }
      case localModalTypes.SHOW_EMAIL_TEMPLATE_MODAL: {
        modalsJSX.push(<EMAIL_TEMPLATE_INPUT data={modal} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.SHOW_WATER_MARK_UPGRADE: {
        modalsJSX.push(<WATER_MARK_UPGRADE data={modal} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.SHOW_COLLECTION_PRESET_MODAL: {
        modalsJSX.push(
          <CollectionPresetModal
            userAuth={userAuth}
            data={modal}
            key={modal.get('id')}
            urls={urls}
            mySubscription={mySubscription}
            boundGlobalActions={boundGlobalActions}
          />
        );
        break;
      }
      case baseModalTypes.CHOOSE_IMG_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          ...modal.toJS(),
          boundGlobalActions,
          boundProjectActions,
        };
        modalsJSX.push(<ChooseImgModal {...props} />);
        break;
      }
      case localModalTypes.ADD_PIC_RULE: {
        modalsJSX.push(<AddPicRuleModal data={modal} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.AI_GROUPS_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
          closeModal: () => {
            const afterClose = modal.get('afterClose');
            afterClose && afterClose();
            boundGlobalActions.hideModal(localModalTypes.AI_GROUPS_MODAL);
          },
        };
        modalsJSX.push(<AIGroupsModal {...props} />);
        break;
      }
      case localModalTypes.EXPORT_AIGROUP_PHOTO_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          ...modal.toJS(),
          boundGlobalActions,
          urls,
          closeModal: () => {
            boundGlobalActions.hideModal(localModalTypes.EXPORT_AIGROUP_PHOTO_MODAL);
          },
        };
        modalsJSX.push(<ExportAiGroupPhotoModal {...props} />);
        break;
      }
      case localModalTypes.VIDEO_VIEWER_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
          ...modal.toJS(),
          closeModal: () => {
            boundGlobalActions.hideModal(localModalTypes.VIDEO_VIEWER_MODAL);
          },
        };
        modalsJSX.push(<VideoViewerModal {...props} />);
        break;
      }
      case localModalTypes.GALLERY_ADD_SLIDESHOW_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
          ...modal.toJS(),
          closeModal: () => {
            boundGlobalActions.hideModal(localModalTypes.GALLERY_ADD_SLIDESHOW_MODAL);
          },
        };
        modalsJSX.push(<GalleryAddSlideshowModal {...props} />);
        break;
      }
      case localModalTypes.MANAGE_CLIENTS_MODAL: {
        const props = {
          data: modal,
          key: modal.get('id'),
          boundGlobalActions,
          boundProjectActions,
          urls,
          ...modal.toJS(),
          closeModal: () => {
            boundGlobalActions.hideModal(localModalTypes.MANAGE_CLIENTS_MODAL);
          },
        };
        modalsJSX.push(<ManageClientsModal {...props} />);
        break;
      }
      default:
        break;
    }
  });

  return modalsJSX;
};
