import { template, toString } from 'lodash';

import { SAAS_UPLOAD_PHOTO_AIPHOTO } from '@resource/lib/constants/apiUrl';
import { UPLOAD_MODAL } from '@resource/lib/constants/modalTypes';

/**
 * 准备图片上传时的body数据.
 * @param {*} opt
 * @param {*} modal
 */
const transformPostBody = (opt, collection_uid) => {
  const { file } = opt;
  let params = {
    file,
    collection_uid,
  };
  if (file.name) {
    params.fileName = file.name;
  }
  return params;
};

const getUploadModalParams = (that, modal) => {
  const { uploadingImages, boundGlobalActions, boundProjectActions, collectionDetail, urls } =
    that.props;
  // 获取当前操作项目的数据
  const maxUploadNum = modal.get('maxUploadNum') || Infinity;
  const collectionId = collectionDetail.get('collection_id');
  const id = modal.get('collectionId') || collectionId;
  return {
    isShown: true,
    maxUploadNum,
    uploadingImages,
    accept: 'image/jpeg, image/jpg',
    uploadUrl: template(SAAS_UPLOAD_PHOTO_AIPHOTO)({
      galleryBaseUrl: urls.get('galleryBaseUrl'),
    }),
    transformPostBody: opt => transformPostBody(opt, id),
    actions: {
      onCloseModal: images => {
        boundGlobalActions.hideModal(UPLOAD_MODAL);
        boundGlobalActions.getMySubscription && boundGlobalActions.getMySubscription();
      },

      onShowConfirm: boundGlobalActions.showConfirm,
      onHideConfirm: boundGlobalActions.hideConfirm,

      onAddImages: boundProjectActions.addImages,
      onUploadSuccess: boundProjectActions.uploadComplete,
      onShowHelp: boundGlobalActions.showFeedback,
    },
    acceptFileTip: t('RETOUCH_PHOTO_ACCEPT_TIP'),
    acceptFileType: 'image/jpeg',
    text: t('FILE_ERROR_JPG_ONLY'),
  };
};

export { getUploadModalParams };
