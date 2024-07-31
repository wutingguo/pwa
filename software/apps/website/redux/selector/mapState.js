import Immutable, { fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';

const emptyArr = fromJS([]);

const systemNode = state => get(state, 'root.system');

const rootNode = state => get(state, 'root');
const getLoading = state => get(state, 'root.loading');
const projectNode = state => get(state, 'gallery');
const imageNode = state => get(state, 'gallery.images');
const collection = state => get(state, 'gallery.collection');
const share = state => get(state, 'gallery.share');

const getEnv = createSelector(rootNode, data => get(data, 'system.env'));

const getUrls = createSelector(getEnv, data => data.urls);
const getEstoreInfo = createSelector(rootNode, data => {
  return data?.estore?.get('estoreInfo');
});

// 用户相关.
const getUserInfo = createSelector(systemNode, data => data.userInfo);

export default state => {
  const newState = {
    ...state
  };
  return newState;
};
