import { get, isEmpty } from 'lodash';

import { wrapPromise } from '@resource/lib/utils/promise';

import {
  COLLECTION_LIMIT_PHOTO_DOWNLOAD,
  GET_SET_VIDEO_BY_SET,
  SAAS_CLIENT_GALLERY_CHECKOUT_DOWNLOAD_PIN,
  SAAS_CLIENT_GALLERY_GENERATE_GALLERY_PHOTOS_ZIP,
  SAAS_CLIENT_GALLERY_GET_DETAIL,
  SAAS_CLIENT_GALLERY_GET_LAST_TIME_ZIP_UUID,
  SAAS_CLIENT_GALLERY_GET_SETS_AND_RESOLUTION,
  SAAS_CLIENT_GALLERY_GET_ZIP_DOWNLOAD_LINK,
  SAAS_CLIENT_SLIDESHOW_PREVIEW_GET_DETAIL,
  SAAS_SLIDE_GET_SHARE_URL,
} from '@resource/lib/constants/apiUrl';

import { CALL_API } from '@resource/lib/middlewares/api';

import { GET_FACE_IMGS } from '@apps/gallery-client-mobile/constants/apiUrl';
import getDataFromState from '@apps/gallery-client-mobile/utils/getDataFromState';

/**
 * 获取详细信息
 */
const getCollectionDetail = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs } = getDataFromState(getState());
      console.log('qs: -------', qs.toJS());
      const customer_uid = qs.get('customer_uid');
      const share_uid = qs.get('share_uid');
      const collection_uid = qs.get('collection_uid');

      if (!collection_uid) {
        return reject('collection_uid is required');
      }

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_GET_DETAIL,
            params: {
              galleryBaseUrl,
              collection_uid,
              customer_uid,
              share_uid,
              autoRandomNum: Date.now(),
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};

// 校验是否可下载及pin
const checkoutGalleryDownloadPin = params => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs } = getDataFromState(getState());

      const collection_uid = qs.get('collection_uid');

      if (!collection_uid) {
        return reject('collection_uid is required');
      }

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_CHECKOUT_DOWNLOAD_PIN,
            params: {
              galleryBaseUrl,
              collection_uid,
              autoRandomNum: Date.now(),
              ...params,
            },
          },
        },
      }).then(response => {
        const status = get(response, 'data');
        if (isEmpty(status)) return resolve(status);

        const {
          is_pin_valid,
          common_download_status,
          common_pin_status,
          common_gallery_download_status,
          common_single_photo_download_status,
        } = status;

        // 不支持下载
        const unSupportDownload =
          !common_download_status ||
          (params.download_type === 1
            ? !common_gallery_download_status
            : !common_single_photo_download_status);

        // 是否需要校验 pin
        const isNeedCheckoutPin = !(
          !common_download_status ||
          !common_pin_status ||
          (params.download_type === 1
            ? !common_gallery_download_status
            : !common_single_photo_download_status) ||
          is_pin_valid
        );

        resolve({
          unSupportDownload,
          isNeedCheckoutPin,
          ...status,
        });
      }, reject);
    });
  };
};

// 获取sets及清晰度
const getSetsAndResolution = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs } = getDataFromState(getState());
      const collection_uid = qs.get('collection_uid');

      if (!collection_uid) {
        return reject('collection_uid is required');
      }

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_GET_SETS_AND_RESOLUTION,
            params: {
              galleryBaseUrl,
              collection_uid,
              autoRandomNum: Date.now(),
            },
          },
        },
      }).then(response => {
        const setsAndResolution = get(response, 'data');
        if (!setsAndResolution) resolve(setsAndResolution);

        const sets_setting = get(setsAndResolution, 'sets_setting');
        const isAllSetNoImg = sets_setting.every(set => get(set, 'image_num') === 0);

        resolve({ isAllSetNoImg, setsAndResolution });
      }, reject);
    });
  };
};

// 获取uuid
const generateGalleryPhotosZip = params => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, favorite } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_GENERATE_GALLERY_PHOTOS_ZIP,
            params: {
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              ...params,
              favorite_uid: favorite.get('favorite_uid'),
            }),
          },
        },
      }).then(response => {
        const zip_uuid = get(response, 'data');
        if (isEmpty(zip_uuid))
          resolve({
            uuid: null,
          });
        resolve({
          uuid: zip_uuid,
        });
      }, reject);
    });
  };
};

// 获取上一次uuid
const getLastTimeZipUUID = collectionId => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, favorite } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_GET_LAST_TIME_ZIP_UUID,
            params: {
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              collection_id: collectionId,
              favorite_uid: favorite.get('favorite_uid'),
            }),
          },
        },
      }).then(response => {
        const zip_uuid = get(response, 'data');
        if (isEmpty(zip_uuid))
          resolve({
            uuid: null,
            lastGeneratedTime: null,
          });
        resolve({
          uuid: get(zip_uuid, 'uuid'),
          lastGeneratedTime: get(zip_uuid, 'download_time'),
          cnLastGeneratedTime: get(zip_uuid, 'cn_download_time'),
        });
      }, reject);
    });
  };
};

// 获取gallery下载链接
const getGalleryDownloadLink = uuid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_GET_ZIP_DOWNLOAD_LINK,
            params: {
              galleryBaseUrl,
              uuid,
              autoRandomNum: Date.now(),
            },
          },
        },
      }).then(response => {
        const downloadLink = get(response, 'data');

        if (!downloadLink) {
          resolve({
            isHasExistedZip: false,
          });
        }
        // const index1 = downloadLink.indexOf('/gcCompress/') + '/gcCompress/'.length;
        const index1 = downloadLink.lastIndexOf('/') + 1;
        const index2 = downloadLink.indexOf('.zip') + 4;
        const downloadName = decodeURI(downloadLink.slice(index1, index2));

        resolve({
          isHasExistedZip: true,
          downloadName,
          downloadUrl: downloadLink,
        });
      }, reject);
    });
  };
};
const getLimitPhotoDownload = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs, detail, guest, favorite } = getDataFromState(getState());

      const collection_id = detail.get('collection_uid');
      const email = favorite.get('email');

      if (!collection_id) {
        return reject('collection_uid is required');
      }
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: COLLECTION_LIMIT_PHOTO_DOWNLOAD,
            params: {
              galleryBaseUrl,
              collection_id,
              email,
              autoRandomNum: Date.now(),
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};
const getFaceImgs = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs, detail } = getDataFromState(getState());

      const collection_id = detail.get('enc_collection_uid');

      if (!collection_id) {
        return reject('collection_uid is required');
      }
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_FACE_IMGS,
            params: {
              galleryBaseUrl,
              enc_collection_id: collection_id,
              // enc_collection_id: 'Al58IiwthkI=',
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};
const getSetVideoInfo = ({ collection_set_id }) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_SET_VIDEO_BY_SET,
            params: {
              galleryBaseUrl,
              collection_set_id,
            },
          },
        },
      }).then(res => {
        if (res && res.data) {
          resolve(res.data);
        }
      });
    });
  };
};
const getSlideshowShareUrl = slideshowUid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      // console.log("galleryBaseUrl...",galleryBaseUrl)
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_GET_SHARE_URL,
            params: {
              galleryBaseUrl,
              project_id: slideshowUid,
            },
          },
        },
      })
        .then(res => {
          const { ret_code, data } = res;
          if (ret_code === 200000) {
            resolve(res);
          } else {
            reject(res);
          }
        })
        .catch(err => reject(err));
    });
  };
};
const getSlideshowInfo = video_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs } = getDataFromState(getState());
      const project_id = video_id;

      if (!project_id) {
        return reject('project_id is required');
      }

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_SLIDESHOW_PREVIEW_GET_DETAIL,
            params: {
              galleryBaseUrl,
              project_id,
              customer_uid: '',
              share_uid: '',
              autoRandomNum: Date.now(),
            },
          },
        },
      }).then(res => {
        if (res && res.data && res.ret_code === 200000) {
          resolve(res);
        }
      }, reject);
    });
  };
};
export default {
  getCollectionDetail,
  checkoutGalleryDownloadPin,
  getSetsAndResolution,
  generateGalleryPhotosZip,
  getLastTimeZipUUID,
  getGalleryDownloadLink,
  getLimitPhotoDownload,
  getFaceImgs,
  getSetVideoInfo,
  getSlideshowInfo,
  getSlideshowShareUrl,
};
