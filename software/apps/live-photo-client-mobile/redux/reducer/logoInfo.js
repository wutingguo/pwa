import { fromJS } from 'immutable';

import { GET_LOADING_INFO } from '@apps/live-photo-client-mobile/constants/actionTypes';

const defaultState = fromJS({
  logoInfo: null,
});
export default function logoReducer(state = defaultState, actions) {
  const { type, data } = actions;
  switch (type) {
    case GET_LOADING_INFO:
      return state.set('logoInfo', data);
    default:
      return state;
  }
}
