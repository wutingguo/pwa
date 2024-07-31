import { SELECT_IMG_BEFORE_IN_EDITOR } from '../../../../constants/actionTypes';

const selectedImgs = (state = [], action) => {
  switch (action.type) {
    case SELECT_IMG_BEFORE_IN_EDITOR: {
      const { payload } = action;
      return payload;
    }

    default:
      return state;
  }
};

export default selectedImgs;
