import request from '@apps/slide-show/utils/request';
import {
  SAAS_GET_ALL_FAVORITE_LIST,
  SAAS_GET_GUEST_FAVORITE_LIST,
  SAAS_COPY_TO_COLLECTION,
  SAAS_CLIENT_GALLERY_UNMARK_FROM_FAVORITE
} from '@resource/lib/constants/apiUrl';
import {
  UPDATE_ALL_FAVORITE_LIST,
  UPDATE_GUEST_FAVORITE_LIST,
  UPDATE_GUEST_LIST_AFTER_DELETE
} from '@apps/slide-show/constants/actionTypes';

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
    payload: {data}
  }
}

// 复制到新的选的选片集
export function copyToCollection({bodyParams, showLoading, hideLoading}) {
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
    url: SAAS_GET_GUEST_FAVORITE_LIST,
    query
  });
}
// 更新单个用户的图片列表数据
export function updateGuestFavoriteList(data) {
  return {
    type: UPDATE_GUEST_FAVORITE_LIST,
    payload: {data}
  }
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
    payload: {data}
  }
}