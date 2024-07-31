import { wrapPromise } from '@resource/lib/utils/promise';

import {
  COLLECTION_DESIGN_SPEC,
  CREATE_GALLERY_PRESET,
  PRESET_SETTING_UPDATE,
  QUERY_PRESET, // SUBDOMAIN_CHECK_URL_SLUG
  RESTRICTED_DOWNLOAD_CLIENT,
  SAAS_CLIENT_GALLERY_LABEL_MODIFY,
  SAAS_GALLERY_RESET_PASSWORD,
  SAAS_GALLERY_STORE_SET_STATUS,
  SAAS_GET_COLLECTIONS_SETTINGS,
  SAAS_PIN_RESET,
  SAAS_UPDATE_COLLECTIONS_SETTINGS,
  SAVE_RESTRICTED_DOWNLOAD_CLIENT,
} from '@resource/lib/constants/apiUrl';

import { CALL_API } from '@resource/lib/middlewares/api';

import {
  UPDATE_COLLECTION_NAME_IN_DETAIL,
  UPDATE_COLLRCTION_SETTING_NAME,
} from '@apps/gallery/constants/actionTypes';
import getDataFromState from '@apps/gallery/utils/getDataFromState';
import request from '@apps/gallery/utils/request';

// 获取 Settings 配置信息
const getCollectionsSettings = collectionUid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_GET_COLLECTIONS_SETTINGS,
            params: {
              galleryBaseUrl,
              collectionUid,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};

const createGalleryPreset = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: CREATE_GALLERY_PRESET,
            params: {
              galleryBaseUrl,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};

const presetSettingUpdate = ({ bodyParams, type, galleryBaseUrl }) => {
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: PRESET_SETTING_UPDATE,
            params: {
              galleryBaseUrl,
              type,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(bodyParams),
          },
        },
      }).then(resolve, reject);
    });
  };
};

const queryGalleryPreset = template_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: QUERY_PRESET,
            params: {
              galleryBaseUrl,
              template_id,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};

// 更新 Settings 配置信息
const updateCollectionsSettings = body => {
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_UPDATE_COLLECTIONS_SETTINGS,
            params: {
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(body),
          },
        },
      }).then(resolve, reject);
    });
  };
};

// 校验url_slug
// const checkUrlSlug = ({ collection_uid, url_slug }) => {
//   return (dispatch, getState) => {
//     return wrapPromise((resolve, reject) => {
//       const { galleryBaseUrl } = getDataFromState(getState());
//       dispatch({
//         [CALL_API]: {
//           apiPattern: {
//             name: SUBDOMAIN_CHECK_URL_SLUG,
//             params: {
//               galleryBaseUrl,
//               collection_uid,
//               url_slug
//             },
//           },
//         },
//       }).then(resolve, reject);
//     });
//   };
// }

const updateCollectionNameInDetail = params => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      dispatch({
        type: UPDATE_COLLECTION_NAME_IN_DETAIL,
        payload: { ...params },
      }).then(resolve, reject);
    });
  };
};

const updateCollectionNameInSetting = collectionName => {
  return {
    type: UPDATE_COLLRCTION_SETTING_NAME,
    payload: { collectionName },
  };
};

const resetPin = collectionUid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_PIN_RESET,
            params: {
              galleryBaseUrl,
              collectionUid,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};

const postResetGalleryPassword = collectionUid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_GALLERY_RESET_PASSWORD,
            params: {
              galleryBaseUrl,
              collectionUid,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};

const switchStoreStatus = ({ collectionUid, storeStatus }) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, estoreBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_GALLERY_STORE_SET_STATUS,
            params: {
              galleryBaseUrl: estoreBaseUrl,
              collectionUid,
              open: Boolean(storeStatus),
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};
// 更新 Settings 配置信息
const updateLabelSetting = body => {
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_LABEL_MODIFY,
            params: {
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(body),
          },
        },
      }).then(resolve, reject);
    });
  };
};
const getDesignSpec = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: COLLECTION_DESIGN_SPEC,
            params: {
              galleryBaseUrl,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};
// TODO: 限制用户下载列表
const getDownloadClinetWhiteList = enc_collection_id => {
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: RESTRICTED_DOWNLOAD_CLIENT,
            params: {
              galleryBaseUrl,
              enc_collection_id,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};

const saveDownloadClinetWhiteList = body => {
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAVE_RESTRICTED_DOWNLOAD_CLIENT,
            params: {
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(body),
          },
        },
      }).then(resolve, reject);
    });
  };
};

export default {
  getCollectionsSettings,
  updateCollectionsSettings,
  updateCollectionNameInDetail,
  resetPin,
  postResetGalleryPassword,
  updateCollectionNameInSetting,
  switchStoreStatus,
  updateLabelSetting,
  createGalleryPreset,
  presetSettingUpdate,
  queryGalleryPreset,
  getDesignSpec,
  getDownloadClinetWhiteList,
  saveDownloadClinetWhiteList,
  // checkUrlSlug
};
