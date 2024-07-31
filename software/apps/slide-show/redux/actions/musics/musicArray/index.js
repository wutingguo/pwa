import {
  DELETE_PROJECT_MUSIC,
  ADD_PROJECT_MUSICS,
  CLEAR_DELETE_PROJECT_MUSIC
} from '@resource/lib/constants/actionTypes';

import getActionKey from '@apps/slide-show/utils/actionKey';

const deleteProjectMusic = encImgId => {
  return {
    type: getActionKey(DELETE_PROJECT_MUSIC),
    encImgId
  };
};

/**
 * 清空deletedImage的值.
 */
const clearDeleteProjectMusic = () => {
  return {
    type: getActionKey(CLEAR_DELETE_PROJECT_MUSIC)    
  };
};

const addProjectMusics = musics => {
  return {
    type: getActionKey(ADD_PROJECT_MUSICS),
    musics
  };
};

export default {
  deleteProjectMusic,
  clearDeleteProjectMusic,
  addProjectMusics
};
