import Immutable, { get } from 'immutable';
import { UPDATE_THEME_PROPERTY, SET_PSD_PAGES } from '../../constants/actionTypes';

const initialState = Immutable.fromJS({
  title: '未命名',
  createdDate: new Date()
});

const propertyReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_THEME_PROPERTY: {
      return state.merge(Immutable.fromJS(action.payload));
    }
    case SET_PSD_PAGES: {
      const { pages } = action;

      if (pages.length) {
        return state.merge({
          title: pages[0].name
        });
      }

      return state;
    }
    default:
      return state;
  }
};

export default propertyReducer;
