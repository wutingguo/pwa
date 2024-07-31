import { UPDATE_THEME_PROPERTY } from '../../constants/actionTypes';

export const updateProjectProperty = payload => {
  return {
    type: UPDATE_THEME_PROPERTY,
    payload
  };
};

export default {
  updateProjectProperty
};
