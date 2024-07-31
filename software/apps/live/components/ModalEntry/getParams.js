import { template, toString } from 'lodash';

import { SAAS_UPLOAD_PHOTO } from '@resource/lib/constants/apiUrl';
import { UPLOAD_MODAL } from '@resource/lib/constants/modalTypes';

import { ALBUM_LIVE_GET_UPLOAD_COMPLETE, ALBUM_LIVE_GET_UPLOAD_URL } from '../../constants/api';
import servers from '../../services/photo';
import {
  check_img_repeat,
  getFetchUploadUrl,
  liveUploadComplete,
  uploadComplete,
} from '../../services/photoLiveSettings';

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
  // uploadingImages 该值在除了 live 中，都是存在redux中，为了方便使用，直接使用即时的 上传图片
  const { uploadingImages, boundGlobalActions, boundProjectActions, urls } = that.props;
  // 获取当前操作项目的数据
  const maxUploadNum = modal.get('maxUploadNum') || Infinity;
  const uploadFilesByS3 = modal.get('uploadFilesByS3');
  const upload_filenames = modal.get('upload_filenames');
  const getUploadedImgs = modal.get('getUploadedImgs') ? modal.get('getUploadedImgs') : () => {};
  const instantUploadImages = modal.get('uploadingImages')
    ? modal.get('uploadingImages').toJS()
    : [];
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  const acceptFileTip = modal.get('acceptFileTip');
  const title = modal.get('title');
  const media_type = modal.get('media_type');
  const maxUploadFileNums = modal.get('maxUploadFileNums');
  const interfaceType = modal.get('interfaceType') || '';
  const enc_album_id = modal.get('enc_album_id') || '';
  const album_category_id = modal.get('album_category_id') || ''; // 新增分类id
  const cusTypeCheck = modal.get('cusTypeCheck')?.toJS();
  const accept = modal.get('accept')?.toJS();
  const isCheckRepeatByInterface = modal.get('isCheckRepeatByInterface') || false; // 新增校验图片名称重复
  return {
    isShown: true,
    maxUploadNum,
    uploadingImages: instantUploadImages || uploadingImages,
    uploadUrl: template(SAAS_UPLOAD_PHOTO)({
      galleryBaseUrl,
    }),
    uploadFilesByS3,
    upload_filenames,
    maxUploadFileNums,
    acceptFileTip,
    title,
    media_type,
    cusTypeCheck,
    accept,
    isCheckRepeatByInterface,
    s3UploadStep: {
      // 校验图片名称重复
      checkImgRepeat: upload_file => {
        const params = {
          baseUrl: galleryBaseUrl,
          enc_album_id,
          image_name: upload_file.client_file_name || upload_file.name,
        };
        return check_img_repeat(params);
      },
      getUploadUrlFromS3: upload_file =>
        getFetchUploadUrl({ baseUrl: galleryBaseUrl, upload_file }),
      uploadFileToS3: () => {
        // 获取第一步 ，拿到s3的上传地址
      },

      notifyUploadResult: file => {
        const { key_name, file_name, file_size } = file;
        if (interfaceType) {
          const suffix = file.key_name.split('.')[1];
          const fileConfig = {
            enc_album_id,
            //图片id
            album_category_id,
            // 分类id
            key_name: file.key_name,
            //图片名称
            content_name: file.file_name,
            content_size: file.file_size,
            //资源类型：1-image，2-audio，3-video
            content_type: 1,
            suffix: suffix,
            /** resolution type 0-raw, 1-original, 2-2000, 3-3000, 4-4000 **/
            resolution_type: 2,
            //机位编号，默认 1
            camera_identifier: '1',
            add_method: 'CLICK',
            add_source: 'PC',
          };

          // 当file中有isReplace时也是替换接口
          const newInterfaceType =
            interfaceType === 'replace_album_content' || file?.file?.isReplace
              ? 'replace_album_content'
              : interfaceType;

          if (newInterfaceType === 'replace_album_content') {
            fileConfig.enc_content_id = file?.file?.enc_content_id;
          }
          const result = liveUploadComplete({
            interfaceType: newInterfaceType,
            baseUrl: galleryBaseUrl,
            upload_success_list: [{ ...fileConfig }],
          });
          return result;
        }
        return uploadComplete({
          baseUrl: galleryBaseUrl,
          upload_success_list: [
            {
              key_name,
              file_name,
              file_size,
            },
          ],
        });
      },
    },
    uploadFileError: __isCN__
      ? ({ file, status, url, headers, keyName }) => {
          const defaultErrorText = t('UPLOAD_S3_FAILED');
          const reportError = {
            key_name: keyName,
            msg: `filename: ${file.name}}`,
          };
          const errorInfo = { errorText: defaultErrorText, httpStatus: status, reportError };
          const params = {
            errorInfo: JSON.stringify(errorInfo),
            requestUrl: url,
            headers,
            productName: 'album_live',
            terminalName: 'pc',
            keyName,
          };
          servers.albumLiveUploadFileError(params);
        }
      : undefined,
    uploadFileNoS3: __isCN__
      ? ({ file, keyName }) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('key_name', keyName);
          formData.append('media_type', media_type || 1);
          formData.append('client_file_name', file.name);
          const defaultErrorText = t('UPLOAD_S3_FAILED');
          const reportError = {
            key_name: keyName,
            msg: `filename:${file.name}}, meg:补偿接口报错`,
          };
          const errorInfo = { errorText: defaultErrorText, httpStatus: null, reportError };
          const params = {
            errorInfo: JSON.stringify(errorInfo),
            requestUrl: '/cloudapi/album_live/upload_file',
            headers: null,
            productName: 'album_live',
            terminalName: 'pc',
            keyName,
          };
          return servers.albumLiveUploadFile(formData).then(
            res => {
              if (res.ret_code === 200000) {
                return res.data;
              }
              servers.albumLiveUploadFileError(params);
            },
            err => {
              servers.albumLiveUploadFileError(params);
            }
          );
        }
      : undefined,
    transformPostBody: opt => transformPostBody(opt, modal),
    actions: {
      onCloseModal: images => {
        boundGlobalActions.hideModal(UPLOAD_MODAL);
        // boundGlobalActions.getMySubscription && boundGlobalActions.getMySubscription();
        //上传完成后，按照当前图片顺序固定排序
        // const imageList = that.props.collectionDetail.get('images');
        // const imageUidsList = imageList.map(i => i.get('image_uid'));
        // boundProjectActions.postResortImages(imageUidsList.toJS());
      },

      onShowConfirm: boundGlobalActions.showConfirm,
      onHideConfirm: boundGlobalActions.hideConfirm,

      onAddImages: () => {},
      onUploadSuccess: successInfo => {
        getUploadedImgs(successInfo);
      },
      onShowHelp: boundGlobalActions.showFeedback,
      // uploadFile: () => {
      //   // formData
      // },
      // uploadError: () => {
      //   // const params = {
      //   //   errorInfo,
      //   //   requestUrl: url,
      //   //   headers: xhr.getAllResponseHeaders(),
      //   // }
      // }
    },
  };
};

export { getUploadModalParams };
