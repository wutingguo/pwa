import { CALL_API } from '@resource/lib/middlewares/api';
import { template } from 'lodash';
import request from '@apps/gallery/utils/request';
import {
  SAAS_GET_COLLECTIONS_LIST,
  SAAS_CREATE_COLLECTION,
  SAAS_UPDATE_COLLECTION,
  SAAS_DELETE_COLLECTION,
  WEBSITE_LIST,
  WEBSITE_DO_PUBLISH,
  WEBSITE_STATUS_POLLING,
  PUBLISH_SUBINFO
} from '@resource/lib/constants/apiUrl';
import { wrapPromise } from '@resource/lib/utils/promise';
import getDataFromState from '@apps/gallery/utils/getDataFromState';

/**
 * 获取 collections 列表
 */
const getWebsiteList = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: WEBSITE_LIST,
            params: {
              galleryBaseUrl
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 获取 publishSubInfo 发布
 */
const publishSubInfo = websiteId => {
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: PUBLISH_SUBINFO,
            params: {
              galleryBaseUrl,
              websiteId: websiteId
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 获取 doPublish 发布
 */
const doPublish = websiteId => {
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: WEBSITE_DO_PUBLISH,
            params: {
              galleryBaseUrl,
              website_id: websiteId
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 获取 publishStatusPolling 轮询
 */
const publishStatusPolling = publish_record_code => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: WEBSITE_STATUS_POLLING,
            params: {
              galleryBaseUrl,
              publish_record_code
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 获取 collections 列表
 */
const createCollection = (collection_name, comment_enabled = true) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CREATE_COLLECTION,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
              collection_name,
              comment_enabled
            })
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 更新 collection
 */
const updateCollection = (collection_uid, collection_name) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_UPDATE_COLLECTION,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
              collection_uid,
              collection_name
            })
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 删除 collection
 */
const deleteCollection = collection_uid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_DELETE_COLLECTION,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
              collection_uid
            })
          }
        }
      }).then(resolve, reject);
    });
  };
};

export default {
  createCollection,
  deleteCollection,
  updateCollection,
  getWebsiteList,
  doPublish,
  publishStatusPolling,
  publishSubInfo,
};
