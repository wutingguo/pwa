import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from '@apps/aiphoto/utils/getDataFromState';
import request from '@apps/aiphoto/utils/request';
import {
  SAAS_GET_AIPHOTO_COLLECTION_PROGRESS,
  SAAS_DELETE_PHOTO_AIPHOTO,
  SAAS_UPDATE_BATCH_PHOTO_AIPHOTO,
  SAAS_GET_AIPHOTO_IMAGE_LIST
} from '@resource/lib/constants/apiUrl';
import {
  SHOW_IMAGE_VIEWER,
  HIDE_IMAGE_VIEWER,
  RESET_COLLECTION_DETAIL,
  SET_DETAIL_CONTENT_LOADING
} from '@apps/aiphoto/constants/actionTypes';
import { GET_CLCT_DETAIL, DELETE_CLCT_SET_IMG } from '@resource/lib/constants/loadingType';

/**
 * 获取详细信息
 */
const getCollectionProgress = collection_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_GET_AIPHOTO_COLLECTION_PROGRESS,
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

const getCollectionImageList = (collection_uid, isOriginal = 1) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_GET_AIPHOTO_IMAGE_LIST,
            params: {
              galleryBaseUrl,
              collection_uid,
              is_original: isOriginal === 1,
              correct_success: isOriginal === 0
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

const postAiPhotoBatch = (collection_id, collection_name) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_UPDATE_BATCH_PHOTO_AIPHOTO,
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
              collection_id
            })
          }
        }
      }).then(res => {
        resolve(res);
      });
    });
  };
};

/**
 * 切换是否选中图片
 * @param {*} id 图片image_uid
 */
const changeSelectedImg = id => {
  return {
    type: 'CHANGE_SELECTION_AIPHOTO',
    payload: { id }
  };
};

// 全选图片
function handleSelectAllImg() {
  return {
    type: 'SELECT_ALL_IMG_AIPHOTO'
  };
}
// 清空选择的图片
function handleClearSelectImg(params) {
  return {
    type: 'CLEAR_SELECTION_AIPHOTO'
  };
}

// 发送删除图片请求
function deletePhotoRequest(bodyParams) {
  return request({
    url: SAAS_DELETE_PHOTO_AIPHOTO,
    method: 'POST',
    bodyParams,
    loadingType: DELETE_CLCT_SET_IMG
  });
}

function updateImgListAfterDelte(data) {
  return {
    type: 'DELETE_IMAGE_AIPHOTO',
    payload: { data }
  };
}

function updateCollectionOriginal(is_original) {
  return {
    type: 'UPDATE_COLLECTION_ORIGINAL',
    payload: { is_original }
  };
}

function updateCollectionHideRetoucher(hideRetoucher) {
  return {
    type: 'UPDATE_COLLECTION_HIDE_RETOUCHER',
    payload: { hideRetoucher }
  };
}

// 预览图片
function showImageViewer(params) {
  return {
    type: SHOW_IMAGE_VIEWER
  };
}
// 隐藏图片
function hideImageViewer(params) {
  return {
    type: HIDE_IMAGE_VIEWER
  };
}

const resetDetail = () => {
  return {
    type: RESET_COLLECTION_DETAIL
  };
};

/**
 * 进入详情、切换set加载loading
 * @param {*} loading
 */
const setDetailContentLoading = loading => {
  return {
    type: SET_DETAIL_CONTENT_LOADING,
    payload: { loading }
  };
};

const updateCollectionId = collectionId => {
  return {
    type: 'UPDATE_COLLECTION_ID',
    payload: { collectionId }
  };
};

const updateAiPhotoBatch = collection_name => {
  return {
    type: 'UPDATE_COLLECTION_BATCH',
    payload: { collection_name }
  };
};

const updateCollectionStatus = collection_status => {
  return {
    type: 'UPDATE_COLLECTION_STATUS',
    payload: { collection_status }
  };
};

export default {
  resetDetail,
  getCollectionProgress,
  changeSelectedImg,
  handleSelectAllImg,
  handleClearSelectImg,
  deletePhotoRequest,
  showImageViewer,
  hideImageViewer,
  setDetailContentLoading,
  updateCollectionId,
  postAiPhotoBatch,
  updateAiPhotoBatch,
  getCollectionImageList,
  updateImgListAfterDelte,
  updateCollectionOriginal,
  updateCollectionStatus,
  updateCollectionHideRetoucher
};
