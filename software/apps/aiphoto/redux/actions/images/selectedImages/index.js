import {
  ADD_IMAGES,
  CLEAR_UPLOADING,
  ADD_STATUS_COUNT,
  AUTO_ADD_PHOTO_TO_CANVAS,
  CLEAR_IMAGES,
  DELETE_IMAGE,
  RESET_STATUS_COUNT,
  RETRY_IMAGE,
  UPDATE_STATUS_COUNT,
  UPLOAD_COMPLETE
} from '@resource/lib/constants/actionTypes';
import getDataFromState from '@apps/gallery/utils/getDataFromState';

function addImages(files) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { userInfo } = stateData;
    // 未登录不上传
    if (!userInfo) {
      return false;
    }
    return dispatch({
      type: ADD_IMAGES,
      payload: {
        files
      }
    });
  };
}

function deleteImage(guid) {
  return (dispatch, getState) => {
    return dispatch({
      type: DELETE_IMAGE,
      guid
    });
  };
}

function retryImage(guid) {
  return (dispatch, getState) => {
    return dispatch({
      type: RETRY_IMAGE,
      guid
    });
  };
}

function uploadComplete(fields) {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPLOAD_COMPLETE_AIPHOTO',
      payload: {
        fields
      }
    });

    return Promise.resolve();
  };
}

function clearUploading() {
  return {
    type: CLEAR_UPLOADING
  };
}

/*
 * 用于设置, 在图片上传完成后, 自动添加到画布中去.
 * @param {boolean} status true: 自动添加到画布, false: 不需要添加
 * @param {string} spreadId
 * @param targetWidth 当前容器, 或画布的宽, 用于图片裁剪
 * @param targetHeight 当前容器, 或画布的高, 用于图片裁剪
 * @returns {{type, status: *, spreadId: *, targetWidth: *, targetHeight: *}}
 */
function autoAddPhotoToCanvas(payload) {
  return {
    type: AUTO_ADD_PHOTO_TO_CANVAS,
    payload
  };
}

function addStatusCount(fieldName, count) {
  return {
    type: ADD_STATUS_COUNT,
    params: {
      fieldName,
      count
    }
  };
}

function updateStatusCount(fieldName, count) {
  return {
    type: UPDATE_STATUS_COUNT,
    params: {
      fieldName,
      count
    }
  };
}

function resetStatusCount() {
  return {
    type: RESET_STATUS_COUNT
  };
}

function clearAllImages() {
  return {
    type: CLEAR_IMAGES
  };
}

export default {
  addImages,
  deleteImage,
  retryImage,
  uploadComplete,
  autoAddPhotoToCanvas,
  addStatusCount,
  updateStatusCount,
  resetStatusCount,
  clearAllImages,
  clearUploading
};
