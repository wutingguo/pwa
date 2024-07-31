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
  UPLOAD_COMPLETE,
  UPLOAD_ALL_COMPLETE
} from '@resource/lib/constants/actionTypes';
import getDataFromState from '@apps/slide-show/utils/getDataFromState';
import getActionKey from '@apps/slide-show/utils/actionKey';
import { withAutoSaving } from '@resource/lib/redux-helper/action';

function addImages(files) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { userInfo } = stateData;
    // 未登录不上传
    if (!userInfo) {
      return false;
    }
    return dispatch({
      type: getActionKey(ADD_IMAGES),
      payload: {
        files
      }
    });
  };
}

function deleteImage(guid) {
  return (dispatch, getState) => {
    return dispatch({
      type: getActionKey(DELETE_IMAGE),
      guid
    });
  };
}

function retryImage(guid) {
  return (dispatch, getState) => {
    return dispatch({
      type: getActionKey(RETRY_IMAGE),
      guid
    });
  };
}

function uploadComplete(fields) {
  // return (dispatch, getState) => {
  //   dispatch(withAutoSaving({
  //     type: getActionKey(UPLOAD_COMPLETE),
  //     payload: {
  //       fields
  //     }
  //   }));

  //   return Promise.resolve();
  // };
  return (dispatch, getState) => {
    dispatch({
      type: getActionKey(UPLOAD_COMPLETE),
      payload: {
        fields
      }
    });

    return Promise.resolve();
  };
}

function uploadAllComplete(images) {
  // return (dispatch, getState) => {
  //   dispatch(withAutoSaving({
  //     type: getActionKey(UPLOAD_ALL_COMPLETE),
  //     payload: images,
  //     mutiply: true
  //   }));

  //   return Promise.resolve();
  // };

  return (dispatch, getState) => {
    dispatch({
      type: getActionKey(UPLOAD_ALL_COMPLETE),
      payload: images,
      mutiply: true
    });

    return Promise.resolve();
  };
}

function clearUploading() {
  return {
    type: getActionKey(CLEAR_UPLOADING)
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
    type: getActionKey(AUTO_ADD_PHOTO_TO_CANVAS),
    payload
  };
}

function addStatusCount(fieldName, count) {
  return {
    type: getActionKey(ADD_STATUS_COUNT),
    params: {
      fieldName,
      count
    }
  };
}

function updateStatusCount(fieldName, count) {
  return {
    type: getActionKey(UPDATE_STATUS_COUNT),
    params: {
      fieldName,
      count
    }
  };
}

function resetStatusCount() {
  return {
    type: getActionKey(RESET_STATUS_COUNT)
  };
}

function clearAllImages() {
  return withAutoSaving({
    type: getActionKey(CLEAR_IMAGES)
  });
}

export default {
  addImages,
  deleteImage,
  retryImage,
  uploadComplete,
  uploadAllComplete,
  autoAddPhotoToCanvas,
  addStatusCount,
  updateStatusCount,
  resetStatusCount,
  clearAllImages,
  clearUploading
};
