import {
  CLEAR_PRODUCT_INFO_FOR_EDITOR,
  SAVE_PRODUCT_INFO_FOR_EDITOR,
} from '../../../../constants/actionTypes';

const saveProductInfo = data => {
  return {
    type: SAVE_PRODUCT_INFO_FOR_EDITOR,
    payload: data,
  };
};

const clearProductInfo = () => {
  return {
    type: CLEAR_PRODUCT_INFO_FOR_EDITOR,
  };
};

export default {
  saveProductInfo,
  clearProductInfo,
};
