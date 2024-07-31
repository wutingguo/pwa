import { fromJS } from 'immutable';

import { sessionStorageEditorStoreKey } from '@resource/components/XEditor/constants/config';
import Storage from '@resource/components/XEditor/lib/utils/storage';

import {
  CLEAR_PRODUCT_INFO_FOR_EDITOR,
  SAVE_PRODUCT_INFO_FOR_EDITOR,
} from '../../../../constants/actionTypes';

const saveProductInfo = (state = fromJS({}), action) => {
  switch (action.type) {
    case SAVE_PRODUCT_INFO_FOR_EDITOR: {
      const { payload } = action;
      return payload;
    }
    case CLEAR_PRODUCT_INFO_FOR_EDITOR: {
      Storage.removeSessionItem(sessionStorageEditorStoreKey);
      return fromJS({});
    }
    default:
      return state;
  }
};

export default saveProductInfo;
