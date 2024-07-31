import Immutable, { get } from 'immutable';
import {
  UPDATE_RATIO
} from '../../constants/actionTypes';

const initialState = Immutable.fromJS({
  ratio: 0,
  contentLoading: false
});

const renderDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_RATIO: {
      const ratio = action.ratio;
      return state.set('ratio', ratio);
    }
    default:
      return state;
  }
};

export default renderDataReducer;
