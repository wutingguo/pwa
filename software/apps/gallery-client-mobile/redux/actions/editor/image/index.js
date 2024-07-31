import { SELECT_IMG_BEFORE_IN_EDITOR } from '../../../../constants/actionTypes';

const saveImgs = data => {
  return {
    type: SELECT_IMG_BEFORE_IN_EDITOR,
    payload: data,
  };
};

export default {
  saveImgs,
};

