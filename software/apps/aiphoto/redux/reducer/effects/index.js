import { fromJS } from 'immutable';
import { get } from 'lodash';
import { API_SUCCESS } from '@resource/lib/constants/actionTypes';
import { convertObjIn } from '@resource/lib/utils/typeConverter';
import { GET_PFC_TOPIC_EFFECTS, GET_TOPIC_CATEGORIES } from '@resource/lib/constants/apiUrl';

const effectsList = (state = fromJS([]), action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case GET_PFC_TOPIC_EFFECTS:
          const effects = convertObjIn(get(action.response, 'data'));
          return fromJS(effects);
        default:
          return state;
      }
    default:
      return state;
  }
};

export default effectsList;
