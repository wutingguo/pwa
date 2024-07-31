import qs from 'qs';
import {
  DELETE_PROJECT_IMAGE,
  ADD_PROJECT_IMAGTES,
  CLEAR_DELETE_PROJECT_IMAGE
} from '@resource/lib/constants/actionTypes';

import getActionKey from '@apps/slide-show/utils/actionKey';

const deleteProjectImage = encImgId => {
  return {
    type: getActionKey(DELETE_PROJECT_IMAGE),
    encImgId
  };
};

/**
 * 清空deletedImage的值.
 */
const clearDeleteProjectImage = () => {
  return {
    type: getActionKey(CLEAR_DELETE_PROJECT_IMAGE)    
  };
};

const addProjectImages = images => {
  return {
    type: getActionKey(ADD_PROJECT_IMAGTES),
    images
  };
};

export default {
  deleteProjectImage,
  clearDeleteProjectImage,
  addProjectImages
};
