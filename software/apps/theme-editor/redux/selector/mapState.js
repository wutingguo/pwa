import Immutable, { fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';
import * as stateHelper from '@apps/theme-editor/utils/mapStateHelper';

const emptyArr = fromJS([]);
const emptyMap = fromJS({});

const rootNode = state => get(state, 'root');
const systemNode = state => get(state, 'root.system');
const getLoading = state => get(state, 'root.loading');
const themeNode = state => get(state, 'theme');

const myPhotos = state => get(state, 'root.myPhotos');
const mySubscription = state => get(state, 'root.system.mySubscription');

const getEnv = createSelector(rootNode, data => get(data, 'system.env'));
const getStudioInfo = createSelector(rootNode, data => get(data, 'system.studioInfo'));

const getUrls = createSelector(getEnv, data => {
  return stateHelper.getUrlsHelper(data.urls);
});

const getPresentTheme = createSelector(themeNode, theme => {
  let presentProjects = {};

  const { pageArray, ...rest } = theme;

  presentProjects = {
    pageArray: get(pageArray, 'present') || pageArray,
    ...rest
  };

  return presentProjects;
});

const getRatios = createSelector(themeNode, theme => {
  const { renderData } = theme;

  return renderData.get('ratios');
});

const getPagination = createSelector(themeNode, theme => {
  const { pagination } = theme;

  return pagination;
});

const getPageArray = createSelector(getPresentTheme, presentTheme => {
  const { pageArray } = presentTheme;
  return pageArray;
});

const getProperty = createSelector(getPresentTheme, presentTheme => {
  const { property } = presentTheme;
  return property;
});

const getUndoData = createSelector(themeNode, theme => {
  const { pageArray } = theme;
  const pastPages = get(pageArray, 'past');
  const futurePages = get(pageArray, 'future');
  return {
    pastCount: pastPages.length,
    futureCount: futurePages.length
  };
});

export default state => {
  const newState = {
    loading: getLoading(state),
    urls: getUrls(state),
    presentTheme: getPresentTheme(state),
    ratios: getRatios(state),
    pageArray: getPageArray(state),
    property: getProperty(state),
    pagination: getPagination(state),
    undoData: getUndoData(state)
  };
  return newState;
};
