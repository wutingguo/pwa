import {
  UPDATE_RATIOS,
  SWITCH_SHEET,
  SWITCH_PAGE,
  CLEAR_HISTORY
} from '@resource/lib/constants/actionTypes';

/**
 * @param {String} key 项目的唯一标识.
 */
export const updateRatio = ratios => {
  return dispatch => {
    return dispatch({
      type: UPDATE_RATIOS,
      ratios
    });
  };
};

/**
 * @param {String} key 项目的唯一标识.
 */
export const switchSheet = switchSheet => {
  return dispatch => {
    dispatch({
      type: CLEAR_HISTORY
    });

    return dispatch({
      type: SWITCH_SHEET,
      index: switchSheet
    });
  };
};

/**
 * @param {String} key 项目的唯一标识.
 */
export const switchPage = (pageIndex, pageId) => {
  return dispatch => {
    return dispatch({
      type: SWITCH_PAGE,
      index: pageIndex,
      id: pageId
    });
  };
};

export default {
  updateRatio
};
