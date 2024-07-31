import { CALL_API } from '@resource/lib/middlewares/api';
import { wrapPromise } from '@resource/lib/utils/promise';
import getDataFromState from '@apps/aiphoto/utils/getDataFromState';
import { GET_PROJECT_EXPORT_URL, GET_PROJECT_EXPORT_URL_CN } from '@resource/lib/constants/apiUrl';

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

export default {
  getProjectExportUrl
};
