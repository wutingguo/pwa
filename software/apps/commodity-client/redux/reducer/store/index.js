import { fromJS, isImmutable } from 'immutable';
import { get, merge } from 'lodash';

import { convertObjIn } from '@resource/lib/utils/typeConverter';

import { API_SUCCESS, LOGINOUT } from '@resource/lib/constants/actionTypes';
import { CLIENT_AUTH_LOGIN } from '@resource/lib/constants/apiUrl';

import { UPDATE_PRINT_PSTORE_INFO } from '@apps/commodity-client/constants/actionTypes';

const initState = fromJS({
  id: null,
  userInfo: {
    user: false,
    id: false,
    enc_sw_id: '',
  },
  isLogin: false,
});
const store = (state = initState, action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case CLIENT_AUTH_LOGIN: {
          const item = convertObjIn(get(action.response, 'data'));
          if (item) {
            const { client_id, token } = item;
          }
          return state;
        }
        default: {
          return state;
        }
      }

    case UPDATE_PRINT_PSTORE_INFO: {
      console.log('====================================');
      console.log(action.data, 'action.data');
      console.log('====================================');
      return state.mergeDeep(fromJS(action.data));
    }
    case LOGINOUT: {
      return state.mergeDeep({ user: null });
    }
    default: {
      return state;
    }
  }
};

export default store;
