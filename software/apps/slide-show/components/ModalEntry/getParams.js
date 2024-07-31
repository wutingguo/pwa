import { template, toString } from 'lodash';
import { SAAS_SLIDE_UPLOAD_PHOTO } from '@resource/lib/constants/apiUrl';
import { UPLOAD_MODAL } from '@resource/lib/constants/modalTypes';
import { uploadStatus } from '@resource/lib/constants/strings';

// slideshow 照片数限制
const exceedFileCounts = 300;

/**
 * 准备图片上传时的body数据.
 * @param {*} opt
 * @param {*} modal
 */
const transformPostBody = (opt, modal) => {
  const { file } = opt;
  const project_id = modal.get('project_id');
  const watermark_uid = modal.get('watermark_uid') || '';

  return {
    file,
    project_id,
    watermark_uid
  };
};

const getUploadModalParams = (that, modal) => {
  const {
    uploadingImages,
    boundGlobalActions,
    boundProjectActions,
    userInfo,
    urls,
    albumId,
    currentSegment
  } = that.props;
  // 获取当前操作项目的数据
  const maxUploadNum = modal.get('maxUploadNum') || Infinity;

  const exceedFileCountsProps = {
    currentFileCounts: currentSegment.get('segmentImages').size,
    exceedFileCounts,
    errorInfo: {
      errorText: t('FILE_EXCEEDS_MAXIMUM_TIP'),
      isAccept: false,
      status: uploadStatus.FAIL
    }
  };

  return {
    isShown: true,
    maxUploadNum,
    isNeedLimitFileCounts: true,
    exceedFileCountsProps,
    errorTextStyle: {
      fontSize: '12px'
    },
    uploadingImages,
    uploadUrl: template(SAAS_SLIDE_UPLOAD_PHOTO)({
      galleryBaseUrl: urls.get('galleryBaseUrl')
    }),
    transformPostBody: opt => transformPostBody(opt, modal),
    actions: {
      onCloseModal: images => {
        boundGlobalActions.hideModal(UPLOAD_MODAL);
        boundGlobalActions.getMySubscription && boundGlobalActions.getMySubscription();
      },

      onShowConfirm: boundGlobalActions.showConfirm,
      onHideConfirm: boundGlobalActions.hideConfirm,

      onAddImages: boundProjectActions.addImages,
      onUploadSuccess: (file, isAllCompleted) => {
        boundProjectActions.uploadComplete(file);

        if (isAllCompleted) {
          // TODO: 保存数据以更新状态，并重新获取详情
          boundProjectActions.saveSlideshow();
        }
      },
      onShowHelp: boundGlobalActions.showFeedback
    }
  };
};

const getUploadGalleryParams = (that, modal) => {
  const {
    urls,
    myPhotos,
    boundGlobalActions,
    boundProjectActions,
    currentSegment,
    userAuth
  } = that.props;
  const project_id = modal.get('project_id');

  const exceedFileCountsProps = {
    currentFileCounts: currentSegment.get('segmentImages').size,
    exceedFileCounts,
    errorInfo: t('FILE_EXCEEDS_MAXIMUM_TIP')
  };

  const myImageModalProps = {
    data: {
      isShown: true,
      urls,
      myPhotos,
      enableCached: false,
      isNeedLimitFileCounts: true,
      exceedFileCountsProps,
      sortField: modal.get('sortField'),
      userAuth
    },
    actions: {
      getImagesGroupByProject: boundGlobalActions.getImagesGroupByProject,
      getImagesGroupByTime: boundGlobalActions.getImagesGroupByTime,
      getImagesGroupByLightRoom: boundGlobalActions.getImagesGroupByLightRoom,
      getImagesGroupByGallery: boundGlobalActions.getImagesGroupByGallery,
      getCollectionsByGallery: boundGlobalActions.getCollectionsByGallery,
      getEditorImagesByGuest: boundGlobalActions.getEditorImagesByGuest,
      getGuestsList: boundGlobalActions.getGuestsList,
      activeGallerySet: boundGlobalActions.activeGallerySet,
      addNotification: boundGlobalActions.addNotification,
      closeModal: modal.get('close'),
      addProjectImages: images => {
        const ids = images.map(v => v.oriEncImageId);

        return boundProjectActions.addGalleryImagesToProject(project_id, ids).then(
          ret => {
            const { isRequestSuccess, data } = ret;

            if (isRequestSuccess) {
              boundGlobalActions.addNotification({
                message: t('UPLOAD_IMAGE_FROM_GALLERY_TO_SLIDE_SUCCESSED_TOAST'),
                level: 'success',
                autoDismiss: 3
              });

              boundProjectActions.uploadAllComplete(data).then(() => {
                // TODO: 保存数据以更新状态，并重新获取详情
                boundProjectActions.saveSlideshow();
              });

              return ret;
            }

            boundGlobalActions.addNotification({
              message: t('UPLOAD_IMAGE_FROM_GALLERY_TO_SLIDE_FAILED_TOAST'),
              level: 'error',
              autoDismiss: 3
            });

            return Promise.reject(ret);
          },
          err => {
            boundGlobalActions.addNotification({
              message: t('UPLOAD_IMAGE_FROM_GALLERY_TO_SLIDE_FAILED_TOAST'),
              level: 'error',
              autoDismiss: 3
            });
            return Promise.reject(err);
          }
        );
      },
      onSaveProject: () => {}
    }
  };

  return myImageModalProps;
};

export { getUploadModalParams, getUploadGalleryParams };
