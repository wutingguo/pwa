import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from '@apps/slide-show/utils/getDataFromState';

import {
  GET_SLIDE_SHOW_MUSIC_TAGS
} from '@resource/lib/constants/apiUrl';


/**
 * 获取音乐库 筛选项
 */
const getMusicTagList = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_SLIDE_SHOW_MUSIC_TAGS,
            params: {
              galleryBaseUrl
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};



export default {
  getMusicTagList
};
