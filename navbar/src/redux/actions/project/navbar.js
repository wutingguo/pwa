import {
  UPDATE_NAVBAR_ITEMS,
  CLEAR_NAVBAR_ITEMS,
  SET_NAVBAR_LABTYPE,
} from '@src/redux/constants/actionTypes';

const updateNavbarItems = data => {
  return {
    type: UPDATE_NAVBAR_ITEMS,
    data
  };
};

const clearNavbarItems = () => {
  return {
    type: CLEAR_NAVBAR_ITEMS
  };
};

const setNavbarLabType = data => {
  return {
    type: SET_NAVBAR_LABTYPE,
    data
  };
};

export default {
  updateNavbarItems,
  clearNavbarItems,
  setNavbarLabType
};