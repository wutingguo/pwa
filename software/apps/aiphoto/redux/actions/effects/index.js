import { CALL_API } from '@resource/lib/middlewares/api';

import { GET_PFC_TOPIC_EFFECTS, GET_TOPIC_CATEGORIES } from '@resource/lib/constants/apiUrl';
import { wrapPromise } from '@resource/lib/utils/promise';
import getDataFromState from '@apps/aiphoto/utils/getDataFromState';

/**
 * 获取 PfcTopicEffects 列表
 */
const getPfcTopicEffects = (curCategory, isSystemPreset = true) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      const getCategory = () => {
        return dispatch({
          [CALL_API]: {
            apiPattern: {
              name: GET_TOPIC_CATEGORIES,
              params: {
                galleryBaseUrl
              }
            }
          }
        });
      };

      const getTopicEffect = category => {
        return dispatch({
          [CALL_API]: {
            apiPattern: {
              name: GET_PFC_TOPIC_EFFECTS,
              params: {
                galleryBaseUrl,
                is_system_preset: isSystemPreset,
                category_code: category
              }
            }
          }
        });
      };
      if (curCategory) {
        getTopicEffect(curCategory).then(res => {
          if (res && res.data) {
            resolve({ effect: res.data });
          }
        });
      } else {
        getCategory().then(res => {
          if (res && res.data) {
            if (res.data.length) {
              getTopicEffect(res.data[0].category_code).then(_res => {
                if (_res && _res.data) {
                  resolve({ effect: _res.data, topicCategory: res.data });
                }
              });
            }
          }
        });
      }
    });
  };
};

export default {
  getPfcTopicEffects
};
