import { fromJS, isImmutable } from 'immutable';
import { get, isEmpty, merge } from 'lodash';

import { convertObjIn } from '@resource/lib/utils/typeConverter';

import { API_FAILURE, API_SUCCESS, UPLOAD_COMPLETE } from '@resource/lib/constants/actionTypes';
import { GET_COMMODITY_INFO, GET_PROJECT_LIST } from '@resource/lib/constants/apiUrl';
import codes from '@resource/lib/constants/responseCode';

const defaultState = fromJS({ isLoadCompleted: false });

const commodity = (state = defaultState, action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case GET_COMMODITY_INFO: {
          const ret_code = get(action.response, 'ret_code');

          // 选片集已经过期
          if (ret_code === codes.C_408000) {
            return state.merge({
              isExpired: true,
              isLoadCompleted: true,
            });
          }

          // collections 删除查询不到数据
          if (ret_code === codes.C_404000) {
            return state.merge({
              isNoData: true,
              isLoadCompleted: true,
            });
          }

          const item = convertObjIn(get(action.response, 'data'));

          return state.merge(fromJS(item), { isLoadCompleted: true });
        }

        case GET_PROJECT_LIST: {
          const myCommodList = get(action.response, 'data');
          if (!myCommodList) return state;
          return state.setIn(['myCommodList'], myCommodList);
        }

        default: {
          return state;
        }
      }
    case API_FAILURE: {
      switch (action.apiPattern.name) {
        case GET_COMMODITY_INFO: {
          return state.merge({ isLoadCompleted: true });
        }

        default: {
          return state;
        }
      }
    }
    default: {
      return state;
    }
  }
};

export default commodity;
