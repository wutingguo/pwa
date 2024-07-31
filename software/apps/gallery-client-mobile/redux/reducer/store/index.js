import { fromJS, isImmutable } from 'immutable';
import { get, merge } from 'lodash';

import * as cookie from '@resource/lib/utils/cookie';
import { convertObjIn } from '@resource/lib/utils/typeConverter';

import {
  API_SUCCESS,
  LOGINOUT,
  UPDATE_PRINT_STORE_INFO,
} from '@resource/lib/constants/actionTypes';
import { SAAS_CLIENT_GALLERY_PRINT_STORE_SING_UP } from '@resource/lib/constants/apiUrl';

const initState = fromJS({
  status: false,
  id: null,
  user: null,
  rackId: null,
  collectionId: null,
  shopCart: {
    nums: 0,
  },
  fetched: {
    status: false,
    user: false,
    id: false,
    rackId: false,
    collectionId: false,
    shopCart: false,
  },
});
const store = (state = initState, action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        // e-store登录  未注册会自动注册
        case SAAS_CLIENT_GALLERY_PRINT_STORE_SING_UP: {
          const item = convertObjIn(get(action.response, 'data'));
          const { extraProps = {} } = action.apiPattern;
          if (item && !__isCN__) {
            const { email = '', store_id = '' } = extraProps;
            const { store_customer_id, token } = item;
            // localStorage.setItem(`${encodeURIComponent(email)}_tk`, );
            localStorage.setItem('_tk_', token);
            localStorage.setItem('_store_id_', store_id);
          }
          return state;
        }
        default: {
          return state;
        }
      }

    case UPDATE_PRINT_STORE_INFO: {
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
