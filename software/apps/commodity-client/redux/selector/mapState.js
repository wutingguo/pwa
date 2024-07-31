import Immutable, { fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';

// import * as stateHelper from '@apps/commodity-client/utils/mapStateHelper';

const emptyMap = fromJS({});
const emptyList = fromJS([]);

const rootNode = state => get(state, 'root');

const storeNode = state => get(state, 'store');
const commodityNode = state => get(state, 'commodity');
const getEnv = createSelector(rootNode, data => get(data, 'system.env'));

const getUrls = createSelector(getEnv, data => data.urls);
const getIsLoadCollectionCompleted = createSelector(commodityNode, commodity => {
  return commodity.get('isLoadCompleted');
});
const getIsShareExpired = createSelector(commodityNode, commodity => {
  return commodity.get('isExpired');
});
const getIsNoData = createSelector(commodityNode, commodity => {
  return commodity.get('isNoData');
});
const getStoreInfo = createSelector(storeNode, store => {
  return store;
});
const getCommodity = createSelector(commodityNode, commodity => commodity);
const getIsLogin = createSelector(storeNode, store => store.get('isLogin'));

export default state => ({
  isLogin: getIsLogin(state),
  isLoadCompleted: getIsLoadCollectionCompleted(state),
  isShareExpired: getIsShareExpired(state),
  isNoData: getIsNoData(state),
  store: getStoreInfo(state),
  commodity: getCommodity(state),
  urls: getUrls(state),
});
