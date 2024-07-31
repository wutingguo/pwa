import React from 'react';

import * as baseModalTypes from '@resource/lib/constants/modalTypes';
import * as localModalTypes from '@apps/slide-show/constants/modalTypes';

import XUploadModal from '@resource/components/modals/XUploadModal';
import XUploadHistoryImagesModal from '@resource/components/modals/XUploadHistoryImagesModal';

import { CreateModal, EditModal } from '@common/components';

import BaseModal from './BaseModal';
import CopyListModal from './CopyListModal';
import GetDirectLinkModal from './GetDirectLinkModal';
import ImageCopyMoveModal from './ImageCopyMoveModal';
// import ShareSlideshowModal from '@resource/components/modals/ShareSlideshowModal';
import ShareSlideshowModal from '@resource/components/modals/ShareSlideshowModal/WithHoc.js';
import AddMusicModal from './AddMusicModal';
import EMAIL_TEMPLATE_INPUT from './EMAIL_TEMPLATE_INPUT';
import PPTViewModal from './PPTViewModal';
import PreviewPostCardModal from './PreviewPostCardModal';
import SelectSizeModal from './SELECT_SIZE';

import { getUploadModalParams, getUploadGalleryParams } from './getParams';

export const getModals = that => {
  const {
    modals,
    urls,
    collectionDetail,
    collectionList,
    mySubscription,
    usedPostCardDetail,
    boundGlobalActions,
    boundProjectActions,
    userInfo
  } = that.props;

  const modalsJSX = [];

  modals.forEach((modal, index) => {
    switch (modal.get('modalType')) {
      case baseModalTypes.UPLOAD_MODAL: {
        const uploadModalProps = getUploadModalParams(that, modal);
        modalsJSX.push(<XUploadModal {...uploadModalProps} key={modal.get('id')} />);
        break;
      }
      case baseModalTypes.UPLOAD_HISTORY_IMAGES_MODAL: {
        const myImageModalProps = getUploadGalleryParams(that, modal);
        modalsJSX.push(<XUploadHistoryImagesModal {...myImageModalProps} key={modal.get('id')} />);
        break;
      }

      case localModalTypes.ADD_MUSIC_SLIDESHOW_MODAL: {
        const {
          musicCategories,
          musicFavorite,
          musicList,
          musicTags,
          collectionDetail
        } = that.props;

        const modalProps = {
          boundGlobalActions,
          boundProjectActions,
          musicCategories,
          musicFavorite,
          musicList,
          musicTags,
          urls,
          collectionId: collectionDetail.get('id'),

          data: modal,
          key: modal.get('id')
        };

        modalsJSX.push(<AddMusicModal {...modalProps} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.NEW_COLLECTION_MODAL: {
        modalsJSX.push(<CreateModal data={modal} key={modal.get('id')} />);
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
      case baseModalTypes.SHARE_SLIDESHOW_MODAL: {
        modalsJSX.push(
          <ShareSlideshowModal
            data={modal}
            collectionList={collectionList}
            key={modal.get('id')}
            urls={urls}
            boundGlobalActions={boundGlobalActions}
            userInfo={userInfo}
          />
        );
        break;
      }
      case localModalTypes.PPT_VIEW_MODAL: {
        modalsJSX.push(
          <PPTViewModal
            key={modal.get('id')}
            data={modal}
            urls={urls}
            usedPostCardDetail={usedPostCardDetail}
            collectionDetail={collectionDetail}
            mySubscription={mySubscription}
            boundGlobalActions={boundGlobalActions}
          />
        );
        break;
      }
      case localModalTypes.PREVIEW_POST_CARD_MODAL: {
        modalsJSX.push(
          <PreviewPostCardModal
            key={modal.get('id')}
            data={modal}
            urls={urls}
            collectionDetail={collectionDetail}
            boundGlobalActions={boundGlobalActions}
          />
        );
        break;
      }
      case localModalTypes.SHOW_SLIDE_SHOW_EMAIL_TEMPLATE_MODAL: {
        modalsJSX.push(<EMAIL_TEMPLATE_INPUT data={modal} key={modal.get('id')} />);
        break;
      }
      case localModalTypes.SELECT_DOWN_SIZE: {
        modalsJSX.push(
          <SelectSizeModal
            key={modal.get('id')}
            data={modal}
            urls={urls}
            collectionDetail={collectionDetail}
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
