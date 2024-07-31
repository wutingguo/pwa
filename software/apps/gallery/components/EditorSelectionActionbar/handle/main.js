import { get, template } from 'lodash';
import React from 'react';
import streamSaver from 'streamsaver';
import 'streamsaver/examples/zip-stream';

import { downImage, fetchImageBlob } from '@resource/lib/utils/image';

import { SAAS_DOWNLOAD_IMAGE } from '@resource/lib/constants/apiUrl';
import { CONFIRM_MODAL } from '@resource/lib/constants/modalTypes';

import imageListMain from '@apps/gallery/components/EditorImageList/handle/main';
import WatermarkList from '@apps/gallery/components/WatermarkList';
import { BASE_MODAL, EDIT_MODAL, IMAGE_COPY_MOVE_MODAL } from '@apps/gallery/constants/modalTypes';

import WatermarkModalCont from '../WatermarkModalCont';

/**
 * 设置成封面.
 * @param {*} that
 * @param {*} item
 */
function onMakeCover() {
  window.logEvent.addPageEvent({
    name: 'GalleryPhotos_Click_MakeCover',
  });
  const { selectedImgCount, collectionDetail, boundProjectActions, boundGlobalActions } =
    this.props;
  if (selectedImgCount != 1) return;
  const { addNotification } = boundGlobalActions;
  const collection_uid = collectionDetail.getIn(['enc_collection_uid']);
  const image_uid = collectionDetail.getIn(['photos', 'selectedImgUidList', 0]);
  boundProjectActions
    .setCover({
      collection_uid,
      image_uid,
    })
    .then(
      res => {
        boundProjectActions.updateCover(get(res, 'data.cover'));
        addNotification({
          message: t('CHANGE_SUCCESSFULLY_SAVED'),
          level: 'success',
          autoDismiss: 2,
        });
      },
      err => {
        addNotification({
          message: t('UNSUCCESSFUL_COVER_CHANGE'),
          level: 'error',
          autoDismiss: 2,
        });
      }
    );
}

// 单个图片重命名
function onRenameImage() {
  window.logEvent.addPageEvent({
    name: 'GalleryPhotos_Click_Rename',
  });
  const { selectedImgCount, collectionDetail, boundGlobalActions, boundProjectActions } =
    this.props;
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
            autoDismiss: 2,
          });
        },
        error => {
          boundGlobalActions.addNotification({
            message: t('RENAME_FAILED'),
            level: 'error',
            autoDismiss: 2,
          });
        }
      );
    },
  };

  boundGlobalActions.showModal(EDIT_MODAL, data);
}

// 下载图片
function onDownload() {
  window.logEvent.addPageEvent({
    name: 'GalleryPhotos_Click_Download',
  });
  const { urls, selectedImgCount, collectionDetail } = this.props;
  const selectedImg = collectionDetail.getIn(['photos', 'selectedImgList']);
  const collection_name = collectionDetail.get('collection_name');
  const sets = collectionDetail.get('sets');
  const currentSetUid = collectionDetail.get('currentSetUid');
  const setName = sets.find(item => item.get('set_uid') == currentSetUid)?.get('set_name');
  const zipFileName = collection_name + '_' + setName + '.zip';
  let downloadData = [];
  selectedImg.forEach(item => {
    const set_uid = item.get('set_uid');
    const image_uid = item.get('enc_image_uid');
    const image_name = item.get('image_name');
    const suffix = item.get('suffix');
    const url = template(SAAS_DOWNLOAD_IMAGE)({
      set_uid,
      image_uid,
      galleryBaseUrl: urls.get('galleryBaseUrl'),
    });
    const imgName = image_name + suffix;
    if (selectedImgCount === 1) {
      downImage(url, imgName);
      return;
    }
    downloadData.push({
      fileUrl: url,
      fileName: imgName,
    });
  });
  if (selectedImgCount === 1 || !downloadData.length) return;
  const fileStream = streamSaver.createWriteStream(zipFileName);
  const fileIterator = downloadData.values();

  const readableZipStream = new window.ZIP({
    async pull(ctrl) {
      const fileInfo = fileIterator.next();
      if (fileInfo.done) {
        ctrl.close();
      } else {
        const { fileName, fileUrl } = fileInfo.value;
        return fetch(fileUrl).then(res => {
          ctrl.enqueue({
            name: fileName + '',
            stream: () => res.body,
          });
        });
      }
    },
  });
  if (window.WritableStream && readableZipStream.pipeTo) {
    return readableZipStream.pipeTo(fileStream).then(() => console.log('下载完了'));
  }
}

// 打开设置水印弹框
function showWaterMarkModal() {
  const { collectionDetail, boundGlobalActions, boundProjectActions, selectedImgCount } =
    this.props;
  const { getWatermarkList, updateWatermarkList } = boundProjectActions;
  let watermarkList = collectionDetail.get('watermarkList');

  window.logEvent.addPageEvent({
    name: 'GalleryPhotos_Click_Watermark',
    PhotoCount: selectedImgCount,
  });

  const showModal = () => {
    const openSetModal = () => {
      boundGlobalActions.hideModal(BASE_MODAL);
      boundGlobalActions.showModal(BASE_MODAL, {
        modalProps: {
          className: 'set-water-mark-modal',
          title: t('SETTINGS_WATERMARK'),
          opened: true,
          escapeClose: true,
          renderChildren: () => <WatermarkList {...this.props} />,
          footer: null,
        },
      });
    };
    const setWateTitle = (
      <span className="set-wate-title" onClick={() => openSetModal()}>
        {t('SET_CUSTOM_WATERMARK')}
      </span>
    );

    boundGlobalActions.showModal(BASE_MODAL, {
      modalProps: {
        className: 'select-water-mark-modal',
        renderTitle: () => (
          <>
            {t('CHOOSE_WATERMARK')}
            {__isCN__ && setWateTitle}
          </>
        ),
        opened: true,
        escapeClose: true,
        renderChildren: () => (
          <WatermarkModalCont ref={node => (this.watermarkRef = node)} {...this.props} />
        ),
        onOk: () => this.watermarkRef.onOk(),
      },
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
  const { collectionDetail, boundGlobalActions, boundProjectActions, selectedImgCount } =
    this.props;
  const { showModal, hideModal, addNotification, getMySubscription } = boundGlobalActions;
  const title = selectedImgCount === 1 ? t('DELETE_PHOTO') : t('DELETE_PHOTOS');
  const message =
    selectedImgCount === 1 ? t('SURE_TO_DELETE_PHOTO') : t('SURE_TO_DELETE_MULTI_PHOTOS');
  // currentSetUid 为空字符，则获取默认set_uid
  // const set_uid = collectionDetail.getIn(['default_set', 'set_uid']);
  const set_uid =
    collectionDetail.get('currentSetUid') || collectionDetail.getIn(['default_set', 'set_uid']);
  const image_uids = collectionDetail
    .getIn(['photos', 'selectedImgList'])
    .map(img => img.get('enc_image_uid'));
  const data = {
    title,
    message,
    close: () => hideModal(CONFIRM_MODAL),
    buttons: [
      {
        text: t('CANCEL'),
        className: 'confirm-btn-delete-cancel',
      },
      {
        text: t('DELETE'),
        className: 'confirm-btn-delete-confirm',
        onClick: () => {
          const bodyParams = { set_uid, image_uids };
          boundProjectActions.deletePhotoRequest(bodyParams).then(
            response => {
              const { ret_code } = response;
              if (ret_code === 200000) {
                boundProjectActions.updateImgListAfterDelte(response.data);
                getMySubscription && getMySubscription();
                addNotification({
                  message: t('PHOTO_DELETED'),
                  level: 'success',
                  autoDismiss: 2,
                });
              } else {
                // error handler
                addNotification({
                  message: t('FAILED_TO_DELETE_PHOTO'),
                  level: 'error',
                  autoDismiss: 2,
                });
              }
            },
            error => {
              addNotification({
                message: t('FAILED_TO_DELETE_PHOTO'),
                level: 'error',
                autoDismiss: 2,
              });
            }
          );
        },
      },
    ],
  };

  window.logEvent.addPageEvent({
    name: 'GalleryPhotos_Click_Delete',
    PhotoCount: selectedImgCount,
  });

  showModal(CONFIRM_MODAL, data);
}

// 移动图片
function onMovePhoto() {
  window.logEvent.addPageEvent({
    name: 'GalleryPhotos_Click_Move',
  });

  const { collectionDetail, collectionDetailSets, boundGlobalActions, boundProjectActions } =
    this.props;
  const {
    showModal,
    hideModal,
    addNotification,
    getMySubscription,
    showGlobalLoading,
    hideGlobalLoading,
  } = boundGlobalActions;
  const { moveToSet, updateImgListAndSetAfterMove } = boundProjectActions;
  const currentSetUid = collectionDetail.get('currentSetUid');
  const otherSets = collectionDetailSets.filter(set => set.get('id') !== currentSetUid);
  const imageUids = collectionDetail
    .getIn(['photos', 'selectedImgList'])
    .map(img => img.get('enc_image_uid'));
  console.log('otherSets: ', otherSets);
  const data = {
    title: t('MOVE_PHOTO'),
    cancelText: t('CANCEL'),
    confirmText: t('MOVE_PHOTO'),
    titleDesc: '移动照片至照片集：',
    otherSets,
    handleSave: setUid => {
      window.logEvent.addPageEvent({
        name: 'GalleryPhotosMove_Click_Move',
      });

      moveToSet(imageUids, setUid, showGlobalLoading, hideGlobalLoading).then(
        response => {
          hideModal(IMAGE_COPY_MOVE_MODAL);
          const { ret_code } = response;

          if (ret_code === 200000) {
            updateImgListAndSetAfterMove({ currentSetUid, ...response.data });
            getMySubscription && getMySubscription();
            addNotification({
              message: t('PHOTOS_MOVED'),
              level: 'success',
              autoDismiss: 2,
            });
          } else {
            // error handler
            addNotification({
              message: t('FAILED_TO_MOVE_PHOTO'),
              level: 'error',
              autoDismiss: 2,
            });
          }
        },
        error => {
          hideModal(IMAGE_COPY_MOVE_MODAL);
          addNotification({
            message: t('FAILED_TO_MOVE_PHOTO'),
            level: 'error',
            autoDismiss: 2,
          });
        }
      );
    },
    handleCancel: () => {
      window.logEvent.addPageEvent({
        name: 'GalleryPhotosMove_Click_Cancel',
      });

      hideModal(IMAGE_COPY_MOVE_MODAL);
    },
    close: () => {
      window.logEvent.addPageEvent({
        name: 'GalleryPhotosMove_Click_Close',
      });

      hideModal(IMAGE_COPY_MOVE_MODAL);
    },
  };
  showModal(IMAGE_COPY_MOVE_MODAL, data);
}

// 复制图片
function onCopyPhoto() {
  window.logEvent.addPageEvent({
    name: 'GalleryPhotos_Click_Copy',
  });

  const { collectionDetail, collectionDetailSets, boundGlobalActions, boundProjectActions } =
    this.props;
  const {
    showModal,
    hideModal,
    addNotification,
    getMySubscription,
    showGlobalLoading,
    hideGlobalLoading,
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
    titleDesc: '将复制图片至照片集：',
    otherSets,
    handleSave: setUid => {
      window.logEvent.addPageEvent({
        name: 'GalleryPhotosCopy_Click_Copy',
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
              autoDismiss: 2,
            });
          } else {
            // error handler
            addNotification({
              message: t('FAILED_TO_COPY_PHOTO'),
              level: 'error',
              autoDismiss: 2,
            });
          }
        },
        error => {
          hideModal(IMAGE_COPY_MOVE_MODAL);
          addNotification({
            message: t('FAILED_TO_COPY_PHOTO'),
            level: 'error',
            autoDismiss: 2,
          });
        }
      );
    },
    handleCancel: () => {
      window.logEvent.addPageEvent({
        name: 'GalleryPhotosCopy_Click_Cancel',
      });

      hideModal(IMAGE_COPY_MOVE_MODAL);
    },
    close: () => {
      window.logEvent.addPageEvent({
        name: 'GalleryPhotosCopy_Click_Close',
      });

      hideModal(IMAGE_COPY_MOVE_MODAL);
    },
  };
  showModal(IMAGE_COPY_MOVE_MODAL, data);
}

// 推荐
function onRecommendPhoto(e, recommend = true) {
  const { collectionDetail, boundProjectActions, boundGlobalActions } = this.props;
  const { postRecommendImages, recommendImages, handleClearSelectImg } = boundProjectActions;
  const { addNotification } = boundGlobalActions;

  const selectedImgList = collectionDetail.getIn(['photos', 'selectedImgList']);
  const isCanRecommendList = selectedImgList.filter(i => !i.get('recommend') === recommend);
  const isCanRecommendUidList = isCanRecommendList.map(i => i.get('enc_image_uid'));

  recommendImages(isCanRecommendUidList, recommend);
  postRecommendImages(isCanRecommendUidList, recommend).then(() => {
    if (recommend) {
      const insertIndex = 0;
      imageListMain.resortImagesFunc(this, insertIndex, isCanRecommendUidList);
    } else {
      handleClearSelectImg();
    }
  });

  addNotification({
    message: t('OPERATE_SUCCESSFULLY'),
    level: 'success',
    autoDismiss: 2,
  });
}
// 不推荐
function onCancelRecommendPhoto() {
  const recommendFunc = onRecommendPhoto.bind(this);
  recommendFunc('', false);
}

export default {
  onMakeCover,
  onRenameImage,
  onDownload,
  onDelete,
  showWaterMarkModal,
  onMovePhoto,
  onCopyPhoto,
  onRecommendPhoto,
  onCancelRecommendPhoto,
};
