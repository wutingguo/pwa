import Immutable, { get } from 'immutable';
import { UPDATE_RATIOS } from '@resource/lib/constants/actionTypes';

const initialState = Immutable.fromJS({
  ratios: {
    innerWorkspace: 0,

    // nav pages
    innerWorkspaceRatioForNavPages: 0
  },
  contentLoading: false
});

const renderDataReducer = (state = initialState, action) => {
  switch (action.type) {
    // 通过key和actionType, 组装成一个新的动态的actionType, 用于可识别特定的项目.
    case UPDATE_RATIOS: {
      const ratios = action.ratios;
      let newState = state;
      ratios.forEach(item => {
        if (typeof item.ratio === 'object' || state.getIn(['ratios', item.type]) !== item.ratio) {
          newState = newState.setIn(['ratios', item.type], item.ratio);
        }
      });
      return newState;
    }
    default:
      return state;
  }
};

export default renderDataReducer;
