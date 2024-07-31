import { fromJS, isImmutable } from 'immutable';
import { get, merge } from 'lodash';
import { API_SUCCESS, UPDATE_GUEST_INFO } from '@resource/lib/constants/actionTypes';
import { SAAS_CLIENT_GALLERY_GUEST_SING_UP } from '@resource/lib/constants/apiUrl';

import { convertObjIn } from '@resource/lib/utils/typeConverter';

const guest = (state = fromJS({}), action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case SAAS_CLIENT_GALLERY_GUEST_SING_UP: {
          const item = convertObjIn(get(action.response, 'data'));
          return state.merge(fromJS(item));
        }

        default: {
          return state;
        }
      }

    case UPDATE_GUEST_INFO: {
      return state.merge(fromJS(action.data));
    }
    default: {
      return state;
    }
  }
};

export default guest;
