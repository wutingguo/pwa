import { template } from 'lodash';

import { getRandomNum } from '@resource/lib/utils/math';
import { wrapPromise } from '@resource/lib/utils/promise';

import {
  GET_PRESET_LIST,
  GET_SESSION_USER_INFO,
  SAAS_CREATE_COLLECTION,
  SAAS_DELETE_COLLECTION,
  SAAS_GET_COLLECTIONS_LIST,
  SAAS_SORT_COLLECTIONS_LIST,
  SAAS_UPDATE_COLLECTION,
} from '@resource/lib/constants/apiUrl';
import { webClientId } from '@resource/lib/constants/strings';

import { CALL_API } from '@resource/lib/middlewares/api';

import getDataFromState from '@apps/gallery/utils/getDataFromState';
import request from '@apps/gallery/utils/request';

/**
 * 获取 collections 列表
 */
const getCollectionList = (searchText = '', current_page = 1, page_size = 10) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
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
 * 创建 collections 列表
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
/**
 * action, 获取用户的会话信息
 */
function getUserInfo() {
  return (dispatch, getState) => {
    const { urls } = getDataFromState(getState());
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_SESSION_USER_INFO,
          params: {
            baseUrl: urls.get('baseUrl'),
            webClientId,
            autoRandomNum: getRandomNum(),
          },
        },
      },
    }).then(res => {
      // const { userInfo } = getDataFromState(getState());
      // const userId = userInfo.get('id');
      // userInfo = userInfo.set('isMonthSubscribe', checkMonth);
      // window.logEvent.setBaseParmas({
      //     CustomerID: userId,
      // });

      // if (userId > 0) {
      //   dispatch(getUserStorageInfo());
      // }
      // console.log('userInfo.toJS()', res);
      window.user = res;
      return res;
    });
  };
}
const getPresetList = ({ customer_id, galleryBaseUrl, platform, businessLine }) => {
  const url = template(GET_PRESET_LIST)({
    customer_id,
    galleryBaseUrl,
  });
  console.log(`${url}&businessLine=${businessLine}&platform=${platform}`);
  return request({
    url: `${url}&businessLine=${businessLine}&platform=${platform}`,
  });
};
export default {
  // getUserInfo,
  getCollectionList,
  createCollection,
  deleteCollection,
  updateCollection,
  sortCollectionList,
  getPresetList,
};
