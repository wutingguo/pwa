import Immutable from 'immutable';
import { SWITCH_SHEET } from '../../constants/actionTypes';
import { SET_PSD_PAGES, CONCAT_PSD_PAGES } from '@resource/lib/constants/actionTypes';

const initialState = Immutable.fromJS({
  prev: 0,
  current: 0,
  total: 0
});

const paginationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SWITCH_SHEET: {
      const { type, ...params } = action;
      return state.merge({
        ...params
      });
    }
    case SET_PSD_PAGES: {
      const { pages } = action;
      return state.merge({
        total: pages.length
      });
    }
    case CONCAT_PSD_PAGES: {
      const { pages } = action;
      return state.merge({
        total: state.get('total') + pages.length
      });
    }
    default:
      return state;
  }
};

export default paginationReducer;
