import Immutable from 'immutable';
import {
  SET_PAGE_ARRAY,
  UPDATE_PAGES,
  DELETE_PAGE,
  SWITCH_SHEET,
  MOVE_PAGE_BEFORE
} from '@apps/theme-editor/constants/actionTypes';
import getDataFromState, {
  getElementPageIdMap,
  getCurrentPage
} from '@apps/theme-editor/utils/getDataFromState';
import { dispatch } from '@resource/lib/utils/bus';

/**
 *  更新批量页面。
 *
 *  @param {string} key 工程键。
 *  @param {Immutable.List<Immutable.Map> | Immutable.Map[]} pages 预定更新的页面的数组。
 */
export const updatePages = pages => {
  return (dispatch, getState) => {
    console.log('xxxx - updatePages');

    dispatch({
      type: UPDATE_PAGES,
      pages
    });

    return Promise.resolve();
  };
};

export const deletePage = pageId => {
  return (dispatch, getState) => {
    dispatch({
      type: DELETE_PAGE,
      pageId
    });
    const { pageArray, pagination } = getDataFromState(getState());
    const pageCount = pageArray.size;
    let { current, total, prev } = pagination.toJS();
    const prevDirection = prev - current;
    if (current > pageCount - 1) {
      current = pageCount - 1;
    }
    dispatch({
      type: SWITCH_SHEET,
      current,
      prev: current + prevDirection,
      total: total - 1
    });
    return Promise.resolve();
  };
};

/**
 *  更新页面。
 *
 *  @param {string} key 工程键。
 *  @param {Immutable.Map} page 预定更新的页面。
 */
export const updatePage = page => {
  return dispatch => {
    return dispatch(updatePages(Immutable.fromJS([page])));
  };
};

export const setPageArray = pageArray => {
  return (dispatch, getState) => {
    const { theme } = getDataFromState(getState());
    dispatch({
      type: SET_PAGE_ARRAY,
      pageArray
    });
    return Promise.resolve();
  };
};

/**
 * 把指定的page插入到特定的page前面.
 * @param  {string} pageId 正在移动的page id
 * @param  {string} beforePageId 插入到指定page的前面的page id.
 */
export function movePageBefore(pageId, beforePageId) {
  return async dispatch => {
    dispatch({
      type: MOVE_PAGE_BEFORE,
      pageId,
      beforePageId
    });
    return Promise.resolve();
  };
}

export default {
  updatePage,
  deletePage,
  updatePages,
  setPageArray,
  movePageBefore
};
