import React from 'react';
import { template, get } from 'lodash';
import {
  EDIT_MODAL,
  BASE_MODAL,
  IMAGE_COPY_MOVE_MODAL
} from '@apps/slide-show/constants/modalTypes';
import { CONFIRM_MODAL } from '@resource/lib/constants/modalTypes';
import { SAAS_DOWNLOAD_IMAGE } from '@resource/lib/constants/apiUrl';
import { downImage } from '@resource/lib/utils/image';
import WatermarkModalCont from '../WatermarkModalCont';

/**
 * 设置成封面.
 * @param {*} that
 * @param {*} item
 */
function onMakeCover() {
  window.logEvent.addPageEvent({
    name: 'SlideShowPhotos_Click_MakeCover'
  });
  const {
    selectedImgCount,
    collectionDetail,
    boundProjectActions,
    boundGlobalActions
  } = this.props;
  if (selectedImgCount != 1) return;
  const { addNotification } = boundGlobalActions;
  const collection_uid = collectionDetail.getIn(['enc_collection_uid']);
  const image_uid = collectionDetail.getIn(['photos', 'selectedImgUidList', 0]);
  boundProjectActions
    .setCover({
      collection_uid,
      image_uid
    })
    .then(
      res => {
        boundProjectActions.updateCover(get(res, 'data.cover'));
        addNotification({
          message: t('CHANGE_SUCCESSFULLY_SAVED'),
          level: 'success',
          autoDismiss: 2
        });
      },
      err => {
        addNotification({
          message: t('UNSUCCESSFUL_COVER_CHANGE'),
          level: 'error',
          autoDismiss: 2
        });
      }
    );
}

// 单个图片重命名
function onRenameImage() {
  window.logEvent.addPageEvent({
    name: 'SlideShowPhotos_Click_Rename'
  });
  const {
    selectedImgCount,
    collectionDetail,
    boundGlobalActions,
    boundProjectActions
  } = this.props;
  if (selectedImgCount != 1) return;
  const selectedImg = collectionDetail.getIn(['photos', 'selectedImgList', 0]);
  const set_uid = selectedImg.get('set_uid');
  const image_uid = selectedImg.get('enc_image_uid');
  const image_name = selectedImg.get('image_name');
  const data = {
    initialValue: image_name,
    title: t('RENAME_PHOTO'),
    message: t('FILENAME'),
    requiredTip: t('PHOTO_NAME_REQUIRED_TIP'),
    illegalTip: t('CREATE_COLLECTION_ILLEGAL_TIP'),
    handleSave: inputValue => {
      const bodyParams = { set_uid, image_uid, image_name: inputValue };
      boundProjectActions.renameImgName(bodyParams).then(
        response => {
          boundProjectActions.updateImgName(response.data);
          boundGlobalActions.hideModal(EDIT_MODAL);
          boundGlobalActions.addNotification({
            message: t('PHOTO_FILENAME_SAVED'),
            level: 'success',
            autoDismiss: 2
          });
        },
        error => {
          boundGlobalActions.addNotification({
            message: t('RENAME_FAILED'),
            level: 'error',
            autoDismiss: 2
          });
        }
      );
    }
  };

  boundGlobalActions.showModal(EDIT_MODAL, data);
}

// 打开设置水印弹框
function showWaterMarkModal() {
  const {
    collectionDetail,
    boundGlobalActions,
    boundProjectActions,
    selectedImgCount
  } = this.props;
  const { getWatermarkList, updateWatermarkList } = boundProjectActions;
  let watermarkList = collectionDetail.get('watermarkList');

  window.logEvent.addPageEvent({
    name: 'SlideShowPhotos_Click_Watermark',
    PhotoCount: selectedImgCount
  });

  const showModal = () => {
    boundGlobalActions.showModal(BASE_MODAL, {
      modalProps: {
        className: 'select-water-mark-modal',
        title: t('CHOOSE_WATERMARK'),
        opened: true,
        escapeClose: true,
        renderChildren: () => (
          <WatermarkModalCont ref={node => (this.watermarkRef = node)} {...this.props} />
        ),
        onOk: () => this.watermarkRef.onOk()
      }
    });
  };
  if (!watermarkList || !watermarkList.size) {
    getWatermarkList().then(res => {
      updateWatermarkList(res.data);
      showModal();
    });
  } else {
    showModal();
  }
}

// 删除图片
function onDelete() {
  const {
    collectionDetail,
    boundGlobalActions,
    boundProjectActions,
    selectedImgCount
  } = this.props;
  const { showModal, hideModal, addNotification } = boundGlobalActions;
  const title = selectedImgCount === 1 ? t('DELETE_PHOTO') : t('DELETE_PHOTOS');
  const message =
    selectedImgCount === 1 ? t('SURE_TO_DELETE_PHOTO') : t('SURE_TO_DELETE_MULTI_PHOTOS');

  window.logEvent.addPageEvent({
    name: 'SlideshowsChoosePhotos_Click_Delete',
    PhotoCount: selectedImgCount
  });

  const data = {
    title,
    message,
    close: () => hideModal(CONFIRM_MODAL),
    buttons: [
      {
        text: t('CANCEL'),
        className: 'confirm-btn-delete-cancel'
      },
      {
        text: t('DELETE'),
        className: 'confirm-btn-delete-confirm',
        onClick: () => {
          boundProjectActions.deteleFrames().then(() => {
            // TODO: 保存数据以更新状态，并重新获取详情
            boundProjectActions.saveSlideshow();
          });
        }
      }
    ]
  };

  window.logEvent.addPageEvent({
    name: 'SlideShowPhotos_Click_Delete',
    PhotoCount: selectedImgCount
  });

  showModal(CONFIRM_MODAL, data);
}

// 复制图片
function onCopyPhoto() {
  window.logEvent.addPageEvent({
    name: 'SlideShowPhotos_Click_Copy'
  });

  const {
    collectionDetail,
    collectionDetailSets,
    boundGlobalActions,
    boundProjectActions
  } = this.props;
  const {
    showModal,
    hideModal,
    addNotification,
    getMySubscription,
    showGlobalLoading,
    hideGlobalLoading
  } = boundGlobalActions;
  const currentSetUid = collectionDetail.get('currentSetUid');
  const otherSets = collectionDetailSets.filter(set => set.get('id') !== currentSetUid);
  const imageUids = collectionDetail
    .getIn(['photos', 'selectedImgList'])
    .map(img => img.get('enc_image_uid'));
  console.log('otherSets: ', otherSets);
  const data = {
    title: t('COPY_PHOTO'),
    cancelText: t('CANCEL'),
    confirmText: t('COPY_PHOTO'),
    otherSets,
    handleSave: setUid => {
      window.logEvent.addPageEvent({
        name: 'SlideShowPhotosCopy_Click_Copy'
      });

      boundProjectActions.copyToSet(imageUids, setUid, showGlobalLoading, hideGlobalLoading).then(
        response => {
          hideModal(IMAGE_COPY_MOVE_MODAL);
          const { ret_code } = response;
          if (ret_code === 200000) {
            boundProjectActions.updateImgListAndSetAfterCopy(response.data);
            getMySubscription && getMySubscription();
            addNotification({
              message: t('PHOTOS_COPIED'),
              level: 'success',
              autoDismiss: 2
            });
          } else {
            // error handler
            addNotification({
              message: t('FAILED_TO_COPY_PHOTO'),
              level: 'error',
              autoDismiss: 2
            });
          }
        },
        error => {
          hideModal(IMAGE_COPY_MOVE_MODAL);
          addNotification({
            message: t('FAILED_TO_COPY_PHOTO'),
            level: 'error',
            autoDismiss: 2
          });
        }
      );
    },
    handleCancel: () => {
      window.logEvent.addPageEvent({
        name: 'SlideShowPhotosCopy_Click_Cancel'
      });

      hideModal(IMAGE_COPY_MOVE_MODAL);
    },
    close: () => {
      window.logEvent.addPageEvent({
        name: 'SlideShowPhotosCopy_Click_Close'
      });

      hideModal(IMAGE_COPY_MOVE_MODAL);
    }
  };
  showModal(IMAGE_COPY_MOVE_MODAL, data);
}

export default {
  onMakeCover,
  onRenameImage,
  onDelete,
  showWaterMarkModal,
  onCopyPhoto
};
