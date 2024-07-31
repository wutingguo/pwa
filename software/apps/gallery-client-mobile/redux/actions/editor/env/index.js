import { CALL_API } from '@resource/lib/middlewares/api';
import { ESTORE_GET_ENV } from '@resource/lib/constants/apiUrl';
import { webClientId } from '@resource/lib/constants/strings';
import { getRandomNum } from '@resource/lib/utils/math';
import { getDZorigin } from '@resource/lib/utils/url';
import getDataFromState from '@resource/lib/utils/getDataFromState';

/**
 * action, 获取环境变量, 如各种api的根路径
 */
function getEditorEnv() {
  return (dispatch, getState) => {
    const { qs } = getDataFromState(getState());
    let apiName = ESTORE_GET_ENV;
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiName,
          params: {
            webClientId,
            baseUrl: getDZorigin(qs),
            autoRandomNum: getRandomNum()
          }
        }
      }
    }).then(res => {
      const { data } = res;
      if (data) {
        return data;
      }
      return res;
    });
  };
}

export default { 
  getEditorEnv 
};
