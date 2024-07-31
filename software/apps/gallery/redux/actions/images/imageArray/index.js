import qs from 'qs';
import {
  DELETE_PROJECT_IMAGE,
  ADD_PROJECT_IMAGTES,
  CLEAR_DELETE_PROJECT_IMAGE
} from '@resource/lib/constants/actionTypes';
import { CALL_API } from '@resource/lib/middlewares/api';

import { DELETE_SERVER_PHOTOS } from '@resource/lib/constants/apiUrl';
import { wrapPromise } from '@resource/lib/utils/promise';
import getDataFromState from '@apps/gallery/utils/getDataFromState';

const deleteProjectImage = encImgId => {
  return {
    type: DELETE_PROJECT_IMAGE,
    encImgId
  };
};

/**
 * 清空deletedImage的值.
 */
const clearDeleteProjectImage = () => {
  return {
    type: CLEAR_DELETE_PROJECT_IMAGE    
  };
};

const addProjectImages = images => {
  return {
    type: ADD_PROJECT_IMAGTES,
    images
  };
};

const deleteServerPhotos = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { baseUrl, deletedImages, albumId } = getDataFromState(getState());

      const deletedEncImgIds = deletedImages.toJS();
      if (!deletedEncImgIds.length) {
        return resolve();
      }

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: DELETE_SERVER_PHOTOS,
            params: { baseUrl }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: qs.stringify({
              data: JSON.stringify({
                albumId,
                images: deletedEncImgIds
              })
            })
          }
        }
      }).then(resolve, reject);
    });
  };
};

export default {
  deleteProjectImage,
  clearDeleteProjectImage,
  addProjectImages,
  deleteServerPhotos
};
