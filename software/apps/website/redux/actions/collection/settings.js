import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from '@apps/gallery/utils/getDataFromState';
import request from '@apps/gallery/utils/request';
import {
  SAAS_GET_COLLECTIONS_SETTINGS,
  SAAS_UPDATE_COLLECTIONS_SETTINGS,
  SAAS_PIN_RESET,
  SAAS_GALLERY_RESET_PASSWORD,
  SAAS_GALLERY_STORE_SET_STATUS,
  SAAS_CLIENT_GALLERY_LABEL_MODIFY
} from '@resource/lib/constants/apiUrl';
import {
  UPDATE_COLLECTION_NAME_IN_DETAIL,
  UPDATE_COLLRCTION_SETTING_NAME
} from '@apps/gallery/constants/actionTypes';

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
              collectionUid
            }
          }
        }
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
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(body)
          }
        }
      }).then(resolve, reject);
    });
  };
};

const updateCollectionNameInDetail = params => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      dispatch({
        type: UPDATE_COLLECTION_NAME_IN_DETAIL,
        payload: { ...params }
      }).then(resolve, reject);
    });
  };
};

const updateCollectionNameInSetting = collectionName => {
  return {
    type: UPDATE_COLLRCTION_SETTING_NAME,
    payload: { collectionName }
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
              collectionUid
            }
          }
        }
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
              collectionUid
            }
          }
        }
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
              open: Boolean(storeStatus)
            }
          }
        }
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
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(body)
          }
        }
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
  updateLabelSetting
};
