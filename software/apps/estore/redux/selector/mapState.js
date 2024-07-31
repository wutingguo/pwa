import Immutable, { fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';

const systemNode = state => get(state, 'root.system');

const rootNode = state => get(state, 'root');
const getEnv = createSelector(rootNode, data => get(data, 'system.env'));

const getUrls = createSelector(getEnv, data => data.urls);

// 用户相关.
const getUserInfo = createSelector(systemNode, data => data.userInfo);

export default state => {
  const newState = {
    envUrls: getUrls(state),
    userInfo: getUserInfo(state)
  };
  return newState;
};
