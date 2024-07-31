import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from '@apps/slide-show/utils/getDataFromState';
import {
  SAAS_UPLOAD_IMAGE_TO_SLIDESHOW_FROM_GALLERY,
} from '@resource/lib/constants/apiUrl';

const addGalleryImagesToProject = (project_id, images) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_UPLOAD_IMAGE_TO_SLIDESHOW_FROM_GALLERY,
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
              project_id, images
            })
          }
        }
      }).then(resolve, reject);
    });
  };
}

export default {
  addGalleryImagesToProject
};