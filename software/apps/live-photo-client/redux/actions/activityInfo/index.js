import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from '@apps/live-photo-client/utils/getDataFromState';
import { GET_ACTIVITY_DETAILS } from '@apps/workspace/constants/apiUrl';
import { HIDE_SPLASH_SCREEN } from '@apps/live-photo-client/constants/actionTypes';

/**
 * 获取直播间详细信息
 */
const getActivityDetail = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { urls, qs } = getDataFromState(getState());
      const baseUrl = urls.get('saasBaseUrl');
      const enc_broadcast_id = qs.get('enc_broadcast_id');
      if (!enc_broadcast_id) {
        return reject('enc_broadcast_id is required');
      }
      dispatch({
        [CALL_API]: {
          isConvert: false,
          apiPattern: {
            name: GET_ACTIVITY_DETAILS,
            params: {
              baseUrl,
              enc_broadcast_id
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};
/**
 * 隐藏启动页
 */
const hideSplashScreen = () => {
  return {
    type: HIDE_SPLASH_SCREEN
  };
};

export default {
  getActivityDetail,
  hideSplashScreen
};
