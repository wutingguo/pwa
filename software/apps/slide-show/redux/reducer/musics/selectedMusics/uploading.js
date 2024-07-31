import Immutable from 'immutable';
import {
  ADD_IMAGES,
  CLEAR_UPLOADING
} from '@resource/lib/constants/actionTypes';
import { guid } from '@resource/lib/utils/math';
import getActionKey from '@apps/slide-show/utils/actionKey';

/**
 * 处理上传中的图片信息.
 * @param state
 * @param action
 * @returns {*}
 */
const uploading = (state = [], action) => {
  switch (action.type) {
    case getActionKey(ADD_IMAGES): {
      const files = Array.from(action.payload.files);
      const newState = files.map(file => {
        file.guid = guid();
        return {
          file
        };
      });
      return [...newState];
    }
    case getActionKey(CLEAR_UPLOADING): {
      return [];
    }

    default:
      return state;
  }
};

export default uploading;
