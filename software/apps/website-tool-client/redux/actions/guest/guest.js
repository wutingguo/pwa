import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from '@apps/gallery-client/utils/getDataFromState';
import {
  SAAS_CLIENT_GALLERY_GUEST_SING_UP,
  SAAS_CLIENT_GALLERY_GUEST_CHECK_PASSWORD
} from '@resource/lib/constants/apiUrl';
import { UPDATE_GUEST_INFO } from '@resource/lib/constants/actionTypes';

/**
 * 获取详细信息
 */
const guestSignUp = params => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs } = getDataFromState(getState());
      const customer_uid = qs.get('customer_uid');
      const collection_uid = qs.get('collection_uid');

      if (!collection_uid) {
        return reject('collection_uid is required');
      }

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_GUEST_SING_UP,
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
              customer_uid,
              collection_uid,
              ...params
            })
          }
        }
      }).then(resolve, reject);
    });
  };
};

const checkPassword = gallery_password => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs } = getDataFromState(getState());
      const collection_uid = qs.get('collection_uid');

      if (!collection_uid) {
        return reject('collection_uid is required');
      }

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_GUEST_CHECK_PASSWORD,
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
              collection_uid,
              gallery_password
            })
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
  guestSignUp,
  updateGuestInfo,
  checkPassword
};
