import { CALL_API } from '@resource/lib/middlewares/api';

import {
  SAAS_GET_AIPHOTO_COLLECTIONS_LIST,
  SAAS_CREATE_AIPHOTO_COLLECTION,
  SAAS_UPDATE_AIPHOTO_COLLECTION,
  SAAS_DELETE_AIPHOTO_COLLECTION,
  SAAS_AIPHOTO_START_BATCH,
  SAAS_AIPHOTO_STOP_BATCH,
  SAAS_OPRATION_AIPHOTO_COLLECTION,
  SAAS_TOPIC_CHANGE_AIPHOTO_COLLECTION,
  SAAS_AIPHOTO_START_BATCH_PART
} from '@resource/lib/constants/apiUrl';
import { wrapPromise } from '@resource/lib/utils/promise';
import getDataFromState from '@apps/aiphoto/utils/getDataFromState';

/**
 * 获取 collections 列表
 */
const getCollectionList = pageNo => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_GET_AIPHOTO_COLLECTIONS_LIST,
            params: {
              galleryBaseUrl,
              pageSize: 10,
              pageNo
            }
          }
        }
      }).then(res => {
        if (res && res.data) {
          const { current, pages } = res.data;
          resolve({ current, pages });
        }
      });
    });
  };
};

/**
 * 新增 collections
 */
const createCollection = collection_name => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CREATE_AIPHOTO_COLLECTION,
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
              collection_name
            })
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 操作权限
 */

const getCollectionOpration = collection_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_OPRATION_AIPHOTO_COLLECTION,
            params: {
              galleryBaseUrl,
              collection_id
            }
          }
        }
      }).then(res => {
        if (res && res.data) {
          resolve(res.data);
        }
      });
    });
  };
};

/**
 * 批次是否更改过topic
 */
const getCollectionTopicChange = collection_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_TOPIC_CHANGE_AIPHOTO_COLLECTION,
            params: {
              galleryBaseUrl,
              collection_id
            }
          }
        }
      }).then(res => {
        resolve(res.data);
      });
    });
  };
};

/**
 * 开始修图
 */
const startCollectionImageAction = (collection_id, topic_code, image_uids) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      const url = !!image_uids ? SAAS_AIPHOTO_START_BATCH_PART : SAAS_AIPHOTO_START_BATCH;
      let params = { collection_id, topic_code };
      if (image_uids) {
        params.image_uids = image_uids;
      }

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: url,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(params)
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 终止修图
 */
const endCollectionImageAction = collection_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_AIPHOTO_STOP_BATCH,
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
              collection_id
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
            name: SAAS_UPDATE_AIPHOTO_COLLECTION,
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
const deleteCollection = collection_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_DELETE_AIPHOTO_COLLECTION,
            params: {
              galleryBaseUrl,
              collection_id
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

export default {
  getCollectionList,
  createCollection,
  deleteCollection,
  updateCollection,
  startCollectionImageAction,
  endCollectionImageAction,
  getCollectionOpration,
  getCollectionTopicChange
};
