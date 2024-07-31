import { fromJS, isImmutable } from 'immutable';
import { get, merge, isEmpty } from 'lodash';
import { API_SUCCESS, API_FAILURE, UPLOAD_COMPLETE } from '@resource/lib/constants/actionTypes';
import { GET_ACTIVITY_DETAILS } from '@apps/workspace/constants/apiUrl';
import codes from '@resource/lib/constants/responseCode';

import { convertObjIn } from '@resource/lib/utils/typeConverter';
import { HIDE_SPLASH_SCREEN } from '@apps/live-photo-client/constants/actionTypes';

const defaultState = fromJS({ isLoadCompleted: false });

const activityInfo = (state = defaultState, action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case GET_ACTIVITY_DETAILS: {
          const ret_code = get(action.response, 'ret_code');
          if (ret_code === codes.C_200000) {
            const item = get(action.response, 'data');
            return state.merge(fromJS(item), { isLoadCompleted: true });
          }
          return state.merge({
            isLoadCompleted: true
          });
        }
        default: {
          return state;
        }
      }
    case API_FAILURE: {
      switch (action.apiPattern.name) {
        case GET_ACTIVITY_DETAILS: {
          return state.merge({ isLoadCompleted: false });
        }
        default: {
          return state;
        }
      }
    }
    case HIDE_SPLASH_SCREEN: {
      return state.update('start_page_vo', item => {
        return item.update('start_page_switch', item => {
          return false;
        });
      });
    }
    default: {
      return state;
    }
  }
};
export default activityInfo;
