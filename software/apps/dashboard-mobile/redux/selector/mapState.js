import Immutable, { fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';

import collectionData from './collectionList';

// import * as stateHelper from '@apps/gallery-client-mobile/utils/mapStateHelper';
const rootNode = state => get(state, 'root');
const getEnv = createSelector(rootNode, data => get(data, 'system.env'));
const getUrls = createSelector(getEnv, data => data.urls);
const systemNode = state => get(state, 'root.system');

const projectNode = state => get(state, 'collection');

const getUserInfo = createSelector(systemNode, data => data.userInfo);
export default state => ({
  ...collectionData(state),
  envUrls: getUrls(state),
  // userInfo: getUserInfo(state),
});
