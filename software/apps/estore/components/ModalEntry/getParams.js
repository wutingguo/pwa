import { template } from 'lodash';

import { UPLOAD_MODAL } from '@resource/lib/constants/modalTypes';

import estoreServices from '../../constants/service';

/**
 * 准备图片上传时的body数据.
 * @param {*} opt
 * @param {*} modal
 */
const transformPostBody = (opt, modal) => {
  const { file } = opt;
  const set_uid = modal.get('set_uid');
  const watermark_uid = modal.get('watermark_uid') || '';

  return {
    file,
    set_uid,
    watermark_uid,
  };
};
export const getUploadModalParams = (that, modal) => {
  // uploadingImages 该值在除了 live 中，都是存在redux中，为了方便使用，直接使用即时的 上传图片
  const { uploadingImages, boundGlobalActions, urls } = that.props;

  // 获取当前操作项目的数据
  const maxUploadNum = modal.get('maxUploadNum') || Infinity;
  const uploadFilesByS3 = modal.get('uploadFilesByS3');
  const upload_filenames = modal.get('upload_filenames');
  const getUploadedImgs = modal.get('getUploadedImgs') ? modal.get('getUploadedImgs') : () => {};
  const instantUploadImages = modal.get('uploadingImages')
    ? modal.get('uploadingImages').toJS()
    : [];
  const estoreBaseUrl = urls.get('estoreBaseUrl');
  const delayAddImage = modal.get('delayAddImage');
  const limitUploadNums = modal.get('limitUploadNums');
  const alreadyUploadNums = modal.get('alreadyUploadNums');
  const maxFileSize = modal.get('maxFileSize');
  const maxItemSize = modal.get('maxItemSize');
  return {
    isShown: true,
    maxUploadNum,
    maxFileSize,
    maxItemSize,
    uploadingImages: instantUploadImages || uploadingImages,
    delayAddImage, // 暂时先保存 图片id， 并且暂时前端渲染图片
    uploadFilesByS3,
    upload_filenames,
    s3UploadStep: {
      getUploadUrlFromS3: upload_files => {
        const len = upload_files.length;
        if (len + alreadyUploadNums > limitUploadNums) {
          boundGlobalActions.hideModal(UPLOAD_MODAL);
          boundGlobalActions.addNotification({
            message: __isCN__ ? '最多可上传6张图片' : 'Up to 6 images can be added!',
            level: 'error',
            autoDismiss: 3,
          });
          return Promise.resolve({
            exceedLimitNum: true,
          });
        }
        return estoreServices.getFetchUploadUrl({ baseUrl: estoreBaseUrl, upload_files });
      },
      uploadFileToS3: () => {
        // 获取第一步 ，拿到s3的上传地址
      },
      notifyUploadResult: file => {},
    },
    transformPostBody: opt => transformPostBody(opt, modal),
    actions: {
      onCloseModal: images => {
        boundGlobalActions.hideModal(UPLOAD_MODAL);
      },

      onShowConfirm: boundGlobalActions.showConfirm,
      onHideConfirm: boundGlobalActions.hideConfirm,

      onAddImages: () => {},
      onUploadSuccess: successInfo => {
        const { file } = successInfo;
        if (delayAddImage && file) {
          const blobData = new Blob([file], { type: file.type });
          successInfo.imgUrl = URL.createObjectURL(blobData);
        }
        getUploadedImgs(successInfo);
      },
      onShowHelp: boundGlobalActions.showFeedback,
    },
  };
};
