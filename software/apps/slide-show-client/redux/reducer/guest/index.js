import { fromJS, isImmutable } from 'immutable';
import { get, merge } from 'lodash';
import { UPDATE_GUEST_INFO } from '@resource/lib/constants/actionTypes';

const guest = (state = fromJS({}), action) => {
  switch (action.type) {
    case UPDATE_GUEST_INFO: {
      return state.merge(fromJS(action.data));
    }
    default: {
      return state;
    }
  }
};

export default guest;
