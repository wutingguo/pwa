import { template, toString } from 'lodash';

import { SAAS_UPLOAD_PHOTO } from '@resource/lib/constants/apiUrl';
import { UPLOAD_MODAL } from '@resource/lib/constants/modalTypes';

import { galleryFetchUploadUrl, uploadVideo } from '@apps/gallery/utils/services';

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

const getUploadModalParams = (that, modal) => {
  const {
    uploadingImages,
    boundGlobalActions,
    boundProjectActions,
    urls,
    mySubscription,
    collectionDetail,
  } = that.props;
  // 获取当前操作项目的数据
  const maxUploadNum = modal.get('maxUploadNum') || Infinity;
  const set_uid = modal.get('set_uid') || '';
  const existedImageList = modal.get('existedImageList')
    ? modal.get('existedImageList').toJS()
    : [];
  return {
    beforeDom: modal.get('beforeDom'),
    isShown: true,
    maxUploadNum,
    set_uid,
    uploadingImages,
    checkRepetition: true,
    existedImageList,
    uploadUrl: template(SAAS_UPLOAD_PHOTO)({
      galleryBaseUrl: urls.get('galleryBaseUrl'),
    }),
    urls: urls.toJS(),
    transformPostBody: opt => transformPostBody(opt, modal),
    actions: {
      onCloseModal: images => {
        boundGlobalActions.hideModal(UPLOAD_MODAL);
        boundGlobalActions.getMySubscription && boundGlobalActions.getMySubscription();

        //上传完成后，按照当前图片顺序固定排序
        const imageList = that.props.collectionDetail.get('images');
        const imageUidsList = imageList.map(i => i.get('enc_image_uid'));
        if (imageUidsList.size > 0) {
          boundProjectActions.postResortImages(imageUidsList.toJS());
        }
        // 上传完成后，获取新增图片接口
        const enc_collection_uid = collectionDetail.get('enc_collection_uid');
        const collection_group_info = collectionDetail.get('collection_group_info');
        const group_status = collection_group_info && collection_group_info.get('group_status');
        if (group_status === 2 || group_status === 1) {
          setTimeout(() => {
            boundProjectActions.getCountFreshImages(enc_collection_uid);
          }, 800);
        }
      },
      addNotification: boundGlobalActions.addNotification,
      onShowConfirm: boundGlobalActions.showConfirm,
      onHideConfirm: boundGlobalActions.hideConfirm,

      onAddImages: boundProjectActions.addImages,
      onUploadSuccess: async (params, isAllCompleted) => {
        const { image_name, suffix, enc_image_uid } = params;
        if (modal.get('startWatermark')) {
          // 存在startWatermark方法 将上传完图片进行打水印
          // modal.get('startWatermark')(params);
          const startWatermarkFn = modal.get('startWatermark');
          startWatermarkFn(
            {
              ...params,
              encImgId: params.enc_image_uid,
            },
            isAllCompleted,
            set_uid
          );
        }
        const { coverInfo, collectionDetail } = that.props;
        const collectionId = collectionDetail.get('enc_collection_uid');
        const image_uid = coverInfo?.get('enc_image_uid');
        if (!image_uid && coverInfo.toJS) {
          boundProjectActions.updateCover({
            ...coverInfo.toJS(),
            image_uid: params.enc_image_uid,
            orientation: params.exifOrientation,
          });
        }
        boundProjectActions.uploadComplete({
          ...params,
          set_uid,
          orientation: params.exifOrientation || 0,
        });
        const { data = [] } = await boundProjectActions.getSetPhotoList(collectionId, set_uid);
        const fildname = `${image_name}${suffix}`.toLowerCase();
        const willDeleted = data
          .filter(
            item => fildname.toLowerCase() === `${item.image_name}${item.suffix}`.toLowerCase()
          )
          .reduce((res, item) => {
            if (item.enc_image_uid !== enc_image_uid) {
              res.push(item.enc_image_uid);
            }
            return res;
          }, []);
        if (willDeleted.length > 0) {
          const bodyParams = { set_uid, image_uids: willDeleted };
          boundProjectActions.deletePhotoRequest(bodyParams).then(res => {
            const { ret_code } = res;
            if (ret_code === 200000) {
              boundProjectActions.getSetPhotoList(collectionId, set_uid).then(eee => {
                console.log('eee: ', eee);
                boundProjectActions.updateImgListAfterDelte(res.data);
              });
            }
          });
        }
      },
      onShowHelp: boundGlobalActions.showFeedback,
    },
    mySubscription,
  };
};

const getOldUploadModalParams = (that, modal) => {
  const {
    uploadingImages,
    boundGlobalActions,
    boundProjectActions,
    urls,
    mySubscription,
    collectionDetail,
  } = that.props;
  // 获取当前操作项目的数据
  const maxUploadNum = modal.get('maxUploadNum') || Infinity;
  const set_uid = modal.get('set_uid') || '';
  return {
    beforeDom: modal.get('beforeDom'),
    isShown: true,
    maxUploadNum,
    uploadingImages,
    uploadUrl: template(SAAS_UPLOAD_PHOTO)({
      galleryBaseUrl: urls.get('galleryBaseUrl'),
    }),
    transformPostBody: opt => transformPostBody(opt, modal),
    actions: {
      onCloseModal: images => {
        boundGlobalActions.hideModal(UPLOAD_MODAL);
        boundGlobalActions.getMySubscription && boundGlobalActions.getMySubscription();
        // 上传完成后，获取新增图片接口
        const enc_collection_uid = collectionDetail.get('enc_collection_uid');
        const collection_group_info = collectionDetail.get('collection_group_info');
        const group_status = collection_group_info && collection_group_info.get('group_status');

        //上传完成后，按照当前图片顺序固定排序
        const imageList = collectionDetail.get('images');
        const imageUidsList = imageList.map(i => i.get('enc_image_uid'));
        if (imageUidsList.size > 0) {
          boundProjectActions.postResortImages(imageUidsList.toJS());
        }
        if (group_status === 2 || group_status === 1) {
          setTimeout(() => {
            boundProjectActions.getCountFreshImages(enc_collection_uid);
          }, 800);
        }
      },

      onShowConfirm: boundGlobalActions.showConfirm,
      onHideConfirm: boundGlobalActions.hideConfirm,

      onAddImages: boundProjectActions.addImages,
      onUploadSuccess: (params, isAllCompleted) => {
        if (modal.get('startWatermark')) {
          // 存在startWatermark方法 将上传完图片进行打水印
          // modal.get('startWatermark')(params);
          const startWatermarkFn = modal.get('startWatermark');
          startWatermarkFn(
            {
              ...params,
              encImgId: params.enc_image_uid,
            },
            isAllCompleted,
            set_uid
          );
        }
        // boundProjectActions.getCollectionDetail(that.props.collectionDetail.get('enc_collection_uid'));
        // boundProjectActions.uploadComplete();
        boundProjectActions.uploadComplete({
          ...params,
          set_uid,
          orientation: params.exifOrientation || 0,
        });
      },
      onShowHelp: boundGlobalActions.showFeedback,
    },
    mySubscription,
  };
};

const getAddVideoModalParams = (that, modal) => {
  const {
    uploadingImages,
    boundGlobalActions,
    boundProjectActions,
    urls,
    mySubscription,
    collectionDetail,
  } = that.props;
  // 获取当前操作项目的数据
  const maxUploadNum = modal.get('maxUploadNum') || 1;
  const set_uid = modal.get('set_uid') || '';
  const uploadFilesByS3 = modal.get('uploadFilesByS3');
  const upload_filenames = modal.get('upload_filenames');
  const instantUploadImages = modal.get('uploadingImages')
    ? modal.get('uploadingImages').toJS()
    : [];
  const getUploadedImgs = modal.get('getUploadedImgs') ? modal.get('getUploadedImgs') : () => {};
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  const acceptFileTip = modal.get('acceptFileTip');
  const title = modal.get('title');
  const media_type = modal.get('media_type');
  const maxUploadFileNums = modal.get('maxUploadFileNums');
  const interfaceType = modal.get('interfaceType') || '';
  const cusTypeCheck = modal.get('cusTypeCheck')?.toJS();
  const accept = modal.get('accept')?.toJS();
  return {
    isShown: true,
    maxUploadNum,
    set_uid,
    uploadingImages: instantUploadImages || uploadingImages,
    checkRepetition: true,
    galleryBaseUrl,
    acceptFileTip,
    title,
    media_type,
    maxUploadFileNums,
    interfaceType,
    cusTypeCheck,
    accept,
    upload_filenames,
    uploadFilesByS3,
    maxFileSize: null,
    uploadUrl: template(SAAS_UPLOAD_PHOTO)({
      galleryBaseUrl: urls.get('galleryBaseUrl'),
    }),
    urls: urls.toJS(),
    transformPostBody: opt => transformPostBody(opt, modal),
    s3UploadStep: {
      getUploadUrlFromS3: upload_file =>
        galleryFetchUploadUrl({ baseUrl: urls.get('galleryBaseUrl'), upload_file }),
      notifyUploadResult: file => {
        const { key_name, file_name, file_size } = file;
        console.log(file, 'file==========>>>>>');
        return uploadVideo({
          baseUrl: urls.get('galleryBaseUrl'),
          set_uid,
          upload_list: [
            {
              key_name,
              file_name,
              file_size,
            },
          ],
        });
      },
    },
    actions: {
      onCloseModal: images => {
        boundGlobalActions.hideModal(UPLOAD_MODAL);
        boundGlobalActions.getMySubscription && boundGlobalActions.getMySubscription();
      },
      addNotification: boundGlobalActions.addNotification,
      onShowConfirm: boundGlobalActions.showConfirm,
      onHideConfirm: boundGlobalActions.hideConfirm,

      onAddImages: boundProjectActions.addImages,
      onUploadSuccess: async (params, isAllCompleted) => {
        const { image_name, suffix, enc_image_uid } = params;
        console.log(params, 'file==========>>>>>');
        boundProjectActions
          .getSetVideoInfo({
            ...params,
            collection_set_id: set_uid,
          })
          .then(videoInfo => {
            const { video_source, video_id } = videoInfo;
            if (video_source === 2) {
              boundProjectActions.getSlideshowInfo(video_id);
            }
          });
      },
      onShowHelp: boundGlobalActions.showFeedback,
    },
    mySubscription,
  };
};
export { getUploadModalParams, getOldUploadModalParams, getAddVideoModalParams };
