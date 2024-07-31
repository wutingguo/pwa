import { CALL_API } from '@resource/lib/middlewares/api';

import {
  GET_DOWNLOADUUID,
  GET_DOWNLOAD_URL_LINK,
  GET_PROJECT_EXPORT_URL,
  GET_PROJECT_EXPORT_URL_CN
} from '@resource/lib/constants/apiUrl';
import { wrapPromise } from '@resource/lib/utils/promise';
import getDataFromState from '@apps/aiphoto/utils/getDataFromState';

const getDownloadUUID = collection_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { saasBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_DOWNLOADUUID,
            params: {
              collection_id,
              saasBaseUrl
            }
          }
        }
      }).then(res => {
        if (res && res.data) {
          resolve(res.data);
        }
      });
    });
  };
};

const getProjectExportUrl = (userId, projectId) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { baseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: __isCN__ ? GET_PROJECT_EXPORT_URL_CN : GET_PROJECT_EXPORT_URL,
            params: {
              userId,
              projectId,
              baseUrl
            }
          }
        }
      }).then(res => {
        if (res && res.data) {
          resolve(res.data);
        }
      });
    });
  };
};

const getDownloadLink = guid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { saasBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_DOWNLOAD_URL_LINK,
            params: {
              guid,
              saasBaseUrl
            }
          }
        }
      }).then(res => {
        if (res && res.data) {
          resolve(res.data);
        }
      });
    });
  };
};

export default {
  getDownloadUUID,
  getDownloadLink,
  getProjectExportUrl
};
