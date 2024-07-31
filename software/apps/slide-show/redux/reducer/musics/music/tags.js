import Immutable from 'immutable';
import { get } from 'lodash';
import {
  API_SUCCESS
} from '@resource/lib/constants/actionTypes';
import { GET_SLIDE_SHOW_MUSIC_TAGS } from '@resource/lib/constants/apiUrl';
import { convertObjIn } from '@resource/lib/utils/typeConverter';

const transformData = (data) => {
  return data.map(item => {
    const values = item.values;
    const newValues = values.map(el => {
      return {
        // ...el,
        label: el.name,
        value: el.id
      }
    });
    newValues.unshift({
      label: 'All',
      value: '-1'
    });
    return {
      option_key: item.option_key,
      values: newValues
    }
  })
};

const tags = (state = Immutable.List([]), action) => {
  switch (action.type) {
    case API_SUCCESS: {
      switch (action.apiPattern.name) {
        case GET_SLIDE_SHOW_MUSIC_TAGS:
          const list = convertObjIn(get(action.response, 'data'));
          return Immutable.fromJS(transformData(list));
        default:
          return state;
      }
    }
    default:
      return state;
  }
};

export default tags;
