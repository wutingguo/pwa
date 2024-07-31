import {fromJS} from 'immutable';
import undoable from '@resource/lib/utils/undoableWithoutKey';

const defaultState = fromJS({
  count: 0
});

/**
 * 更新设备类型.
 */
const s = (state = defaultState, action) => {
  switch (action.type) {
    case 'CLOCK_INCREAM': {
      return state.merge({
        count: state.get('count') + 1
      });
    }
    default:
      return state;
  }
};

const includeActionTypes = [
  'CLOCK_INCREAM'
];

export default undoable(s, {
  filter: includeActionTypes,
  limit: 10
});