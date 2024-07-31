import {
  UPDATE_RATIO
} from '../../constants/actionTypes';

/**
 * @param {String} key 项目的唯一标识.
 */
export const updateRatio = ratio => {
  return dispatch => {
    return dispatch({
      type: UPDATE_RATIO,
      ratio
    });
  };
};

