import Immutable, { fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';

import * as stateHelper from '@apps/gallery/utils/mapStateHelper';

const rootNode = state => get(state, 'root');
const getEnv = createSelector(rootNode, data => get(data, 'system.env'));
const getUrls = createSelector(getEnv, data => data.urls);
const systemNode = state => get(state, 'root.system');
const collection = state => get(state, 'collection');
const getCollectionsList = createSelector(collection, getUrls, (data, urls) => {
  return stateHelper.getConvertCollectionsList(data, urls);
});

const getCollectionDetail = createSelector(collection, getUrls, (data, urls) => {
  return stateHelper.getCollectionDetail(data, urls);
});

const getCollectionsSettings = createSelector(collection, getUrls, (data, urls) => {
  return stateHelper.transformCollectionSettings(data, urls);
});

const getCollectionPresetSettings = createSelector(collection, getUrls, (data, urls, preset) => {
  return stateHelper.transformPresetSettings(data, urls);
});
const getDefaultImgs = createSelector(getUrls, stateHelper.getDefaultImgs);
export default state => ({
  // list: getCollectionsList(state),
  collectionList: getCollectionsList(state),
  collectionDetail: getCollectionDetail(state),
  collectionsSettings: getCollectionsSettings(state),
  collectionPresetSettings: getCollectionPresetSettings(state),
  defaultImgs: getDefaultImgs(state),
});
