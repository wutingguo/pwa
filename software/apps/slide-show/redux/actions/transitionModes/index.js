import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from '@apps/slide-show/utils/getDataFromState';
import { SAAS_SLIDE_GET_TRANSITION_MODES } from '@resource/lib/constants/apiUrl';


const getTransitionModes = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_GET_TRANSITION_MODES,
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
  getTransitionModes
}