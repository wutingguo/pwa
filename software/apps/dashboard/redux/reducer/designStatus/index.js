import { fromJS } from 'immutable';
import { get } from 'lodash';
import { UPDATE_DESIGNER_STATUS } from '@resource/lib/constants/actionTypes';

const designStatus = (state = fromJS({}), action) => {
  switch (action.type) {
    case UPDATE_DESIGNER_STATUS:
      return action.payload
    default:
      return state;
  }
};

export default designStatus;
