import {
  UPDATE_CATEGORY_LIST,
  UPDATE_LAB_LIST,
  UPDATE_LAB_STATE
} from '@resource/lib/constants/actionTypes';

const initialState = {
  listData: [],
  categoryList: [],
  templateSizeList: []
}

export default (state = initialState, action) => {
  const payload = action.payload || {};
  switch (action.type) {
    case UPDATE_LAB_STATE:
      return {
        ...state,
        ...payload
      }
    default:
      return state;
  }
};
