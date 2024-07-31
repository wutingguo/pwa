import { UPDATE_MATTING_PROPERTY } from '../../constants/actionTypes'

export const updateProperty = property => {
    return dispatch => {
      return dispatch({
        type: UPDATE_MATTING_PROPERTY,
        property
      });
    };
  };     