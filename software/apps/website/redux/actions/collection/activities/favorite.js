import request from '@apps/gallery/utils/request';
import {
  SAAS_GET_ALL_FAVORITE_LIST,
  SAAS_GET_GUEST_FAVORITE_LIST,
  SAAS_COPY_TO_COLLECTION,
  SAAS_CLIENT_GALLERY_UNMARK_FROM_FAVORITE,
  SAAS_GET_FAVORITE_PACKAGE,
  SAAS_EXPORT_FAVORITE_PACKAGE,
  SAAS_GET_GUEST_CN_FAVORITE_LIST
} from '@resource/lib/constants/apiUrl';
import {
  UPDATE_ALL_FAVORITE_LIST,
  UPDATE_GUEST_FAVORITE_LIST,
  UPDATE_GUEST_LIST_AFTER_DELETE
} from '@apps/gallery/constants/actionTypes';

import { wrapPromise } from '@resource/lib/utils/promise';
import getDataFromState from '@apps/gallery/utils/getDataFromState';
import { CALL_API } from '@resource/lib/middlewares/api';

// 获取所有客户的 favorite list
export function getAllFavoriteList(query) {
  return request({
    url: SAAS_GET_ALL_FAVORITE_LIST,
    query
  });
}
// 更新所有客户的 favorite list
export function updateFavoriteList(data) {
  return {
    type: UPDATE_ALL_FAVORITE_LIST,
    payload: { data }
  };
}

// 复制到新的选的选片集
export function copyToCollection({ bodyParams, showLoading, hideLoading }) {
  return request({
    url: SAAS_COPY_TO_COLLECTION,
    method: 'POST',
    bodyParams,
    showLoading,
    hideLoading
  });
}

// 获取单个用户的图片列表
export function getGuestFavoriteList(query) {
  return request({
    url: __isCN__ ? SAAS_GET_GUEST_CN_FAVORITE_LIST : SAAS_GET_GUEST_FAVORITE_LIST,
    query
  });
}
// 更新单个用户的图片列表数据
export function updateGuestFavoriteList(data) {
  return {
    type: UPDATE_GUEST_FAVORITE_LIST,
    payload: { data }
  };
}
// 删除favorite image
export function deleteFavoriteImg(bodyParams) {
  return request({
    url: SAAS_CLIENT_GALLERY_UNMARK_FROM_FAVORITE,
    method: 'POST',
    bodyParams
  });
}
// 删除图片后更新列表
export function updateListAfterDelte(data) {
  return {
    type: UPDATE_GUEST_LIST_AFTER_DELETE,
    payload: { data }
  };
}

export function getFavoritePackage(collection_favorite_id) {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_GET_FAVORITE_PACKAGE,
            params: {
              galleryBaseUrl,
              collection_favorite_id
            }
          }
        }
      }).then(resolve, reject);
    });
  };
}

// 选片批量导出
export function exportFavoritesList(collection_id) {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_EXPORT_FAVORITE_PACKAGE,
            params: {
              galleryBaseUrl,
              collection_id
            }
          }
        }
      }).then(resolve, reject);
    });
  };
}
