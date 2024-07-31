import Immutable from 'immutable';
import { get } from 'lodash';
import {
  API_SUCCESS
} from '@resource/lib/constants/actionTypes';
import { SAAS_SLIDE_GET_TRANSITION_MODES } from '@resource/lib/constants/apiUrl';
import { convertObjIn } from '@resource/lib/utils/typeConverter';

const transitionModes = (state = Immutable.List([]), action) => {
  switch (action.type) {
    case API_SUCCESS: {
      switch (action.apiPattern.name) {
        case SAAS_SLIDE_GET_TRANSITION_MODES:
          const list = convertObjIn(get(action.response, 'data'));
          return Immutable.fromJS(list);
        default:
          return state;
      }
    }
    default:
      return state;
  }
};

export default transitionModes;
