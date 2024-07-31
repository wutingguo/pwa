import { fromJS } from 'immutable';
import { get } from 'lodash';
import {
  API_SUCCESS,
  DELETE_MUSICL_LIST
} from '@resource/lib/constants/actionTypes';
import {
  SAAS_SLIDE_GET_MUSIC_LIST,
  SAAS_SLIDE_DELETE_MUSICE,
  SAAS_SLIDE_GET_MUSIC_LIST_NEW,
} from '@resource/lib/constants/apiUrl';
import { convertObjIn } from '@resource/lib/utils/typeConverter';
import getActionKey from '@apps/slide-show/utils/actionKey';

const r = (state = fromJS({}), action) => {
  switch (action.type) {
    case API_SUCCESS: {
      switch (action.apiPattern.name) {
        case SAAS_SLIDE_GET_MUSIC_LIST:
          const data = convertObjIn(get(action.response, 'data'));
          return fromJS(data);
        case SAAS_SLIDE_GET_MUSIC_LIST_NEW:
          const dataList = convertObjIn(get(action.response, 'data'));
          return fromJS(dataList);

        case SAAS_SLIDE_DELETE_MUSICE:
          const enc_id = convertObjIn(get(action.response, 'data.enc_id'));

          const records = state.get('records');
          const index = records.findIndex(v => v.get('enc_id') === enc_id);
          if (index !== -1) {
            const newRecords = records.remove(index);
            return state.merge({ records: newRecords, total: newRecords.size })
          }
          return state;

        default:
          return state;
      }
    }
    case getActionKey(DELETE_MUSICL_LIST): {
      return fromJS({})
    }
    default:
      return state;
  }
};

export default r;
