import Immutable, { get } from 'immutable';
import { SET_IMAGES } from '../../constants/actionTypes';

const initialState = Immutable.fromJS([]);

const images = (state = initialState, action) => {
  switch (action.type) {
    case SET_IMAGES: {
      return state.merge(Immutable.fromJS(action.images));
    }
    default:
      return state;
  }
};

export default images;
