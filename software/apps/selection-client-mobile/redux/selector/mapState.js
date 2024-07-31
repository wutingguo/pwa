import Immutable, { fromJS } from 'immutable';
import { get, isEmpty } from 'lodash';
import { createSelector } from 'reselect';

const rootNode = state => get(state, 'root');
const getEnv = createSelector(rootNode, data => get(data, 'system.env'));
const getUrls = createSelector(getEnv, data => data.urls);

const getUserInfo = createSelector(rootNode, data => get(data, 'system.userInfo'));
const shellNode = state => get(state, 'shell');

export default state => {
  const newState = {
    envUrls: getUrls(state),
    userInfo: getUserInfo(state),
  };
  return newState;
};
