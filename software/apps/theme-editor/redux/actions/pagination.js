import Immutable from 'immutable';
import getDataFromState, {
  getElementPageIdMap,
  getCurrentPage
} from '@apps/theme-editor/utils/getDataFromState';
import { SWITCH_SHEET, CLEAR_HISTORY } from '@resource/lib/constants/actionTypes';

export const switchSheet = sheetIndex => {
  return (dispatch, getState) => {
    dispatch({
      type: CLEAR_HISTORY
    });
    const { pagination } = getDataFromState(getState());
    let { current } = pagination.toJS();
    dispatch({
      type: CLEAR_HISTORY
    });
    return dispatch({
      type: SWITCH_SHEET,
      current: sheetIndex,
      prev: current
    });
  };
};

export const prev = () => {
  return (dispatch, getState) => {
    const { pagination } = getDataFromState(getState());
    const { current } = pagination.toJS();
    let sheetIndex = current;
    if (current > 0) {
      sheetIndex--;
    }
    dispatch({
      type: CLEAR_HISTORY
    });
    return dispatch({
      type: SWITCH_SHEET,
      current: sheetIndex,
      prev: current
    });
  };
};

export const next = () => {
  return (dispatch, getState) => {
    const { pagination } = getDataFromState(getState());
    const { current, total } = pagination.toJS();
    let sheetIndex = current;
    if (current < total - 1) {
      sheetIndex++;
    }
    dispatch({
      type: CLEAR_HISTORY
    });
    return dispatch({
      type: SWITCH_SHEET,
      current: sheetIndex,
      prev: current
    });
  };
};
