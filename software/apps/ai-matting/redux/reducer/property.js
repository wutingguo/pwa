import Immutable, { get } from 'immutable';
import { UPDATE_MATTING_PROPERTY } from '../../constants/actionTypes';

const initialState = Immutable.fromJS({
  isOpenMatting: true, //是否开启抠图
  projectId: ''
});

const propertyReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MATTING_PROPERTY: {
      return state.merge(Immutable.fromJS(action.property));
    }
    default:
      return state;
  }
};

export default propertyReducer;
