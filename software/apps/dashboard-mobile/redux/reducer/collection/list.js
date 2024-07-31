import { fromJS } from 'immutable';
import { get } from 'lodash';

import { convertObjIn } from '@resource/lib/utils/typeConverter';

import { API_SUCCESS } from '@resource/lib/constants/actionTypes';
import {
  SAAS_CREATE_COLLECTION,
  SAAS_DELETE_COLLECTION,
  SAAS_GET_COLLECTIONS_LIST,
  SAAS_SORT_COLLECTIONS_LIST,
  SAAS_UPDATE_COLLECTION,
} from '@resource/lib/constants/apiUrl';

const collectionsList = (state = fromJS([]), action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case SAAS_GET_COLLECTIONS_LIST:
          const items = convertObjIn(get(action.response, 'data.records'));
          if (action.response.data.current_page === 1) {
            return fromJS(items);
          }
          return state.merge(fromJS(items));

        // case SAAS_CREATE_COLLECTION:

        //   const createItem = convertObjIn(get(action.response, 'data'));
        //   console.log()
        //   return state.push(fromJS(createItem));

        case SAAS_UPDATE_COLLECTION:
          const updateItem = convertObjIn(get(action.response, 'data'));
          const updateCollectionUid = get(updateItem, 'enc_collection_uid');
          const updateIndex = state.findIndex(
            item => item.get('enc_collection_uid') === updateCollectionUid
          );
          return updateIndex !== -1
            ? state.setIn([updateIndex, 'collection_name'], get(updateItem, 'collection_name'))
            : state;

        case SAAS_DELETE_COLLECTION:
          const deleteCollectionUid = get(convertObjIn(action.response), 'data.enc_collection_uid');
          const deleteIndex = state.findIndex(
            item => item.get('enc_collection_uid') === deleteCollectionUid
          );
          return deleteIndex !== -1 ? state.delete(deleteIndex) : state;
        // case SAAS_SORT_COLLECTIONS_LIST:
        //   const sortItems = convertObjIn(get(action.response, 'data.records'));
        //   return fromJS(sortItems);
        default:
          return state;
      }
    default:
      return state;
  }
};

export default collectionsList;
