import { UPDATE_DESIGNER_STATUS } from '@resource/lib/constants/actionTypes';

const updateDesignerStatus = payload => {
  return {
    type: UPDATE_DESIGNER_STATUS,
    payload
  }
};

export default {
  updateDesignerStatus
};
