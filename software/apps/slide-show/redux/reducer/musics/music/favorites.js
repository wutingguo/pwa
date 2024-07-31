import { fromJS } from 'immutable';
import { get } from 'lodash';
import {
  API_SUCCESS, DELETE_FAVORITE_LIST
} from '@resource/lib/constants/actionTypes';
import {
  SAAS_SLIDE_GET_FAVORITE_MUSICE_LIST,
  SAAS_SLIDE_TOGGLE_MUSIC_FAVORITE
} from '@resource/lib/constants/apiUrl';
import { convertObjIn } from '@resource/lib/utils/typeConverter';
import getActionKey from '@apps/slide-show/utils/actionKey';

const defaultState = fromJS({
  total: 0,
  records: []
});

const r = (state = defaultState, action) => {
  switch (action.type) {
    case API_SUCCESS: {
      switch (action.apiPattern.name) {
        case SAAS_SLIDE_GET_FAVORITE_MUSICE_LIST:
          const data = convertObjIn(get(action.response, 'data'));
          return fromJS(data);
        // case SAAS_SLIDE_TOGGLE_MUSIC_FAVORITE:
        //   const item = get(action.response, 'data');
        //   const { enc_id } = item;

        //   const records = state.get('records');
        //   const index = records.findIndex(v => v.get('enc_id') === enc_id);
        //   if (index !== -1) {
        //     const newItem = records.get(index);

        //     return state.setIn(['records', String(index)], newItem.merge({
        //       is_favorite: !newItem.get('is_favorite')
        //     }));
        //   }

        //   const newRecords = records.push(fromJS({ 
        //     enc_id, 
        //     is_favorite: true 
        //   }));
        //   return state.merge({ records: newRecords, total: newRecords.size });
        default:
          return state;
      }
    }
    case getActionKey(DELETE_FAVORITE_LIST): {
      return defaultState;
    }
    default:
      return state;
  }
};

export default r;
