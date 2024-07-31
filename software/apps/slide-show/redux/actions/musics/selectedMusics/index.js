import {
  ADD_MUSICS,
  CLEAR_MUSIC_UPLOADING,
  ADD_MUSIC_STATUS_COUNT,
  CLEAR_MUSICS,
  DELETE_MUSIC,
  RESET_MUSIC_STATUS_COUNT,
  RETRY_MUSIC,
  UPDATE_MUSIC_STATUS_COUNT,
  UPLOAD_MUSIC_COMPLETE
} from '@resource/lib/constants/actionTypes';
import getDataFromState from '@apps/slide-show/utils/getDataFromState';
import getActionKey from '@apps/slide-show/utils/actionKey';

function addSelectedMusics(files) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { userInfo } = stateData;
    // 未登录不上传
    if (!userInfo) {
      return false;
    }
    return dispatch({
      type: getActionKey(ADD_MUSICS),
      payload: {
        files
      }
    });
  };
}

function deleteSelectedMusic(guid) {
  return (dispatch, getState) => {
    return dispatch({
      type: getActionKey(DELETE_MUSIC),
      guid
    });
  };
}

function retrySelectedMusic(guid) {
  return (dispatch, getState) => {
    return dispatch({
      type: getActionKey(RETRY_MUSIC),
      guid
    });
  };
}

function uploadMusicComplete(fields) {
  return (dispatch, getState) => {
    dispatch({
      type: getActionKey(UPLOAD_MUSIC_COMPLETE),
      payload: {
        fields
      }
    });

    return Promise.resolve();
  };
}

function clearMusicUploading() {
  return {
    type: getActionKey(CLEAR_MUSIC_UPLOADING)
  };
}

function addMusicStatusCount(fieldName, count) {
  return {
    type: getActionKey(ADD_MUSIC_STATUS_COUNT),
    params: {
      fieldName,
      count
    }
  };
}

function updateMusicStatusCount(fieldName, count) {
  return {
    type: getActionKey(UPDATE_MUSIC_STATUS_COUNT),
    params: {
      fieldName,
      count
    }
  };
}

function resetMusicStatusCount() {
  return {
    type: getActionKey(RESET_MUSIC_STATUS_COUNT)
  };
}

function clearAllMusics() {
  return {
    type: getActionKey(CLEAR_MUSICS)
  };
}

export default {
  addSelectedMusics,
  deleteSelectedMusic,
  retrySelectedMusic,
  uploadMusicComplete,
  addMusicStatusCount,
  updateMusicStatusCount,
  resetMusicStatusCount,
  clearAllMusics,
  clearMusicUploading
};
