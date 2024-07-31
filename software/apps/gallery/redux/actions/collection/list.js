import { wrapPromise } from '@resource/lib/utils/promise';

import {
  SAAS_CREATE_COLLECTION,
  SAAS_DELETE_COLLECTION,
  SAAS_GET_COLLECTIONS_LIST,
  SAAS_SORT_COLLECTIONS_LIST,
  SAAS_UPDATE_COLLECTION,
} from '@resource/lib/constants/apiUrl';

import { CALL_API } from '@resource/lib/middlewares/api';

import getDataFromState from '@apps/gallery/utils/getDataFromState';

/**
 * 获取 collections 列表
 */
const getCollectionList = (searchText = '', current_page = 1, page_size = 20) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      // debugger
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_GET_COLLECTIONS_LIST,
            params: {
              galleryBaseUrl,
              collection_name: searchText,
              current_page,
              page_size,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};

/**
 * 获取 collections 列表
 */
const createCollection = (
  collection_name,
  comment_enabled = true,
  template_id,
  ordering,
  event_time
) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CREATE_COLLECTION,
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
              collection_name,
              comment_enabled,
              template_id,
              ordering,
              event_time,
            }),
          },
        },
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
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              collection_uid,
              collection_name,
            }),
          },
        },
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
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              collection_uid,
            }),
          },
        },
      }).then(resolve, reject);
    });
  };
};
/**
 * collection 排序
 */
const sortCollectionList = (rule, current_page = 1, page_size = 20) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      // debugger
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SORT_COLLECTIONS_LIST,
            params: {
              galleryBaseUrl,
              rule,
              current_page,
              page_size,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};
export default {
  getCollectionList,
  createCollection,
  deleteCollection,
  updateCollection,
  sortCollectionList,
};
