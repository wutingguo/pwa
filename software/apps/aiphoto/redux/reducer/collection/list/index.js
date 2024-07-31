import { fromJS } from 'immutable';
import { get } from 'lodash';
import { API_SUCCESS } from '@resource/lib/constants/actionTypes';
import { convertObjIn } from '@resource/lib/utils/typeConverter';
import {
  SAAS_GET_AIPHOTO_COLLECTIONS_LIST,
  SAAS_UPDATE_AIPHOTO_COLLECTION,
  SAAS_DELETE_AIPHOTO_COLLECTION
} from '@resource/lib/constants/apiUrl';

const collectionsList = (state = fromJS([]), action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case SAAS_GET_AIPHOTO_COLLECTIONS_LIST:
          const items = convertObjIn(get(action.response, 'data.records'));
          return fromJS(items);
        case SAAS_UPDATE_AIPHOTO_COLLECTION:
          const updateItem = convertObjIn(get(action.response, 'data'));
          const updateCollectionUid = get(updateItem, 'id');
          const updateIndex = state.findIndex(item => item.get('id') === updateCollectionUid);
          return updateIndex !== -1
            ? state.setIn([updateIndex, 'collection_name'], get(updateItem, 'collection_name'))
            : state;

        case SAAS_DELETE_AIPHOTO_COLLECTION:
          const deleteCollectionUid = get(convertObjIn(action.response), 'data.id');
          const deleteIndex = state.findIndex(item => item.get('id') === deleteCollectionUid);
          return deleteIndex !== -1 ? state.delete(deleteIndex) : state;

        default:
          return state;
      }
    default:
      return state;
  }
};

export default collectionsList;
