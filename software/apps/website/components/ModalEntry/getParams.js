import { template, toString } from 'lodash';
import { SAAS_UPLOAD_PHOTO } from '@resource/lib/constants/apiUrl';
import { UPLOAD_MODAL } from '@resource/lib/constants/modalTypes';

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
    albumId
  } = that.props;
  // 获取当前操作项目的数据
  const maxUploadNum = modal.get('maxUploadNum') || Infinity;
  const set_uid = modal.get('set_uid') || '';
  return {
    isShown: true,
    maxUploadNum,
    set_uid,
    uploadingImages,
    uploadUrl: template(SAAS_UPLOAD_PHOTO)({
      galleryBaseUrl: urls.get('galleryBaseUrl')
    }),
    urls: urls.toJS(),
    transformPostBody: opt => transformPostBody(opt, modal),
    actions: {
      onCloseModal: images => {
        boundGlobalActions.hideModal(UPLOAD_MODAL);
        boundGlobalActions.getMySubscription && boundGlobalActions.getMySubscription();

        //上传完成后，按照当前图片顺序固定排序
        const imageList = that.props.collectionDetail.get('images');
        const imageUidsList = imageList.map(i => i.get('image_uid'));
        // const enc_collection_uid = that.props.collectionDetail.get('enc_collection_uid');
        // const { data: imageList } = await boundProjectActions.getSetPhotoList(enc_collection_uid, set_uid);
        // console.log('imageList: ######', imageList);
        // const imageUidsList = imageList.map(i => i.image_uid);
        if (imageUidsList.size > 0) {
          boundProjectActions.postResortImages(imageUidsList.toJS());
        }
      },

      onShowConfirm: boundGlobalActions.showConfirm,
      onHideConfirm: boundGlobalActions.hideConfirm,

      onAddImages: boundProjectActions.addImages,
      onUploadSuccess: params => {
        console.log('params: ', params);
        boundProjectActions.uploadComplete({
          ...params,
          set_uid,
          orientation: params.exifOrientation || 0
        });
      },
      onShowHelp: boundGlobalActions.showFeedback
    }
  };
};

export { getUploadModalParams };
