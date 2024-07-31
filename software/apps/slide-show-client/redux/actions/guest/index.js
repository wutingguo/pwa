import { fromJS, isImmutable } from 'immutable';
import { get, merge } from 'lodash';
import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from '@apps/slide-show-client/utils/getDataFromState';
import { API_SUCCESS, UPDATE_GUEST_INFO } from '@resource/lib/constants/actionTypes';
import { SAAS_CLIENT_SLIDE_SHOW_CHECK_PASSWORD } from '@resource/lib/constants/apiUrl';

import { convertObjIn } from '@resource/lib/utils/typeConverter';
const checkPassword = slideshow_password => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs } = getDataFromState(getState());
      const collection_uid = qs.get('collection_uid');
      const project_id = qs.get('project_id');

      if (!project_id) {
        return reject('project_id is required');
      }

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_SLIDE_SHOW_CHECK_PASSWORD,
            params: {
              galleryBaseUrl,
              project_id,
              slideshow_password
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};
const updateGuestInfo = data => {
  return {
    type: UPDATE_GUEST_INFO,
    data
  };
};
export default {
  checkPassword,
  updateGuestInfo
};
