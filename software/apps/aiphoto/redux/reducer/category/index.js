import { fromJS } from 'immutable';
import { get } from 'lodash';
import { API_SUCCESS } from '@resource/lib/constants/actionTypes';
import { convertObjIn } from '@resource/lib/utils/typeConverter';
import { GET_TOPIC_CATEGORIES } from '@resource/lib/constants/apiUrl';

const categoryList = (state = fromJS([]), action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case GET_TOPIC_CATEGORIES:
          const category = convertObjIn(get(action.response, 'data'));
          return fromJS(category);
        default:
          return state;
      }
    default:
      return state;
  }
};

export default categoryList;
