import { createSelector } from 'reselect';
import { get } from 'lodash';
import { fromJS } from 'immutable';

const emptyMap = fromJS({});
const systemNode = state => get(state, 'root.system');
const projectNode = state => get(state, 'project');
const getNavbarOptions = createSelector(projectNode, data=> data.navbar);

// env相关
const getEnv = createSelector(systemNode, data => data.env);
const getQs = createSelector(getEnv, data => data.qs);
const getUrls = createSelector(getEnv, data => data.urls);
const getBaseUrl = createSelector(getUrls, urls => urls.get('baseUrl'));

// global相关.
const getGlobal = createSelector(systemNode, data => data.global);
const getModals = createSelector(getGlobal, data => get(data, 'alerts.modals'));

// 用户相关
const getUserInfo = createSelector(systemNode, data => data.userInfo);
const getIsUserLogined = createSelector(getUserInfo, data => {
  return data && data.get('id') !== -1;
});
const getIsUserLoadCompleted = createSelector(getUserInfo, data => {
  return data.get('isLoadCompleted');
});
const getUserStorage = createSelector(systemNode, data => data.userStorage);
const getMySubscription = createSelector(getNavbarOptions, data => data.get('mySubscription'));
const getPlanList = createSelector(systemNode, data => data.planList);

const getIsZnoLab = createSelector(getNavbarOptions, data => data.get('isZnoLab'));
const getProductCode = createSelector(getNavbarOptions, data => data.get('productCode'));
const getStudioInfo = createSelector(systemNode, data => data.studioInfo);

/**
 * 各个产品的订阅状态.
 */
const getProductSubscriptionStatus = createSelector(getPlanList, data => {
  if (!data.size) {
    return emptyMap;
  }

  let result = emptyMap;
  data.mapEntries(mapper => {
    const [key, list] = mapper;
    const isSubscribed = list.findIndex(el => el.get('subscribed')) !== -1;

    result = result.merge(fromJS({
      [key]: isSubscribed
    }));
  });

  return result;
});

const getUserAuth = createSelector(getUserInfo, userInfo => {
  if (userInfo) {
    return {
      customerId: userInfo.get('id'),
      timestamp: userInfo.get('timestamp'),
      securityToken: userInfo.get('authToken')
    };
  }

  return {};
});

export const mapStateToProps = state => ({
  navbarOptions: getNavbarOptions(state),

  // 环境相关
  qs: getQs(state),
  urls: getUrls(state),
  baseUrl: getBaseUrl(state),

  // global相关.
  modals: getModals(state),

  // 用户相关
  userInfo: getUserInfo(state),
  studioInfo: getStudioInfo(state),
  isUserLoadCompleted: getIsUserLoadCompleted(state),
  isUserLogined: getIsUserLogined(state),
  userAuth: getUserAuth(state),
  userStorage: getUserStorage(state),
  mySubscription: getMySubscription(state),
  planList: getPlanList(state),
  productSubscriptionStatus: getProductSubscriptionStatus(state),

  isZnoLab: getIsZnoLab(state),
  productCode: getProductCode(state)
});
