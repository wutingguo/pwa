import Immutable from 'immutable';
import { get } from 'lodash';
import {
  API_SUCCESS
} from '@resource/lib/constants/actionTypes';
import { SAAS_SLIDE_GET_MUSIC_CATEGORIES } from '@resource/lib/constants/apiUrl';
import { convertObjIn } from '@resource/lib/utils/typeConverter';

const categories = (state = Immutable.List([]), action) => {
  switch (action.type) {
    case API_SUCCESS: {
      switch (action.apiPattern.name) {
        case SAAS_SLIDE_GET_MUSIC_CATEGORIES:
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

export default categories;
