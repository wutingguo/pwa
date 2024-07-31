import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from '@apps/slide-show/utils/getDataFromState';
import request from '@apps/slide-show/utils/request';
import {
  SAAS_GET_COLLECTIONS_SETTINGS,
  SAAS_UPDATE_COLLECTIONS_SETTINGS,
  SAAS_SLIDE_GET_DOWNLOAD_SETTING,
  SAAS_SLIDE_SAVE_DOWNLOAD_SETTING,
  SAAS_SLIDE_GET_DOWNLOAD_PIN,
  SAAS_SLIDE_RESET_PIN,
  SAAS_SLIDE_CHECK_PIN,
  SAAS_SLIDE_GET_SLIDESHOW_PWD_SETTINGS,
  SAAS_SLIDE_RESET_SLIDESHOW_PWD_SETTINGS,
  SAAS_SLIDE_UPDATE_SLIDESHOW_PWD_SETTINGS
} from '@resource/lib/constants/apiUrl';
import { UPDATE_COLLECTION_NAME_IN_DETAIL } from '@apps/slide-show/constants/actionTypes';

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

// 获取下载配置
const getDownloadSettings = ({ project_id }) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_GET_DOWNLOAD_SETTING,
            params: {
              galleryBaseUrl,
              project_id
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

// 保存下载配置信息
const saveDownloadSettings = body => {
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_SAVE_DOWNLOAD_SETTING,
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

// 获取slideshowPWD配置
const getSlideshowPwdSettings = ({ project_id }) => {
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_GET_SLIDESHOW_PWD_SETTINGS,
            params: {
              project_id,
              galleryBaseUrl
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

// 重置slideshowPWD配置
const resetSlideshowSettings = body => {
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_RESET_SLIDESHOW_PWD_SETTINGS,
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

// 更新slideshowPWD配置
const updateSlideshowSettings = body => {
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_UPDATE_SLIDESHOW_PWD_SETTINGS,
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

// 获取下载  查询PIN
const getDownloadPin = ({ project_id }) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_GET_DOWNLOAD_PIN,
            params: {
              galleryBaseUrl,
              project_id
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

// Reset PIN接口
const getDownloadResetPin = ({ project_id }) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_RESET_PIN,
            params: {
              galleryBaseUrl,
              project_id
            }
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
  getDownloadSettings,
  saveDownloadSettings,
  getSlideshowPwdSettings,
  resetSlideshowSettings,
  updateSlideshowSettings,
  getDownloadPin,
  getDownloadResetPin
};
