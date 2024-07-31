import Immutable, { fromJS } from 'immutable';
import { get, isEmpty } from 'lodash';
import { createSelector } from 'reselect';

const rootNode = state => get(state, 'root');
const getEnv = createSelector(rootNode, data => get(data, 'system.env'));
const getUrls = createSelector(getEnv, data => data.urls);

const activityInfoNode = state => get(state, 'activityInfo');
const userInfoNode = state => get(state, 'userInfo');

const isLoadCompleted = createSelector(activityInfoNode, data => data.get('isLoadCompleted'));
const getStartPage = createSelector(activityInfoNode, data => data.get('start_page_vo'));
const getIsShowSplashScreen = createSelector(
  getStartPage,
  data => data && data.get('start_page_switch')
);
const getBroadcastActivity = createSelector(activityInfoNode, data =>
  data.get('broadcast_activity')
);
const getBanner = createSelector(activityInfoNode, data => data.get('banner_vo'));
const getIsShowBanner = createSelector(getBanner, data => data && data.get('banner_type') !== 1);
const getMenu = createSelector(activityInfoNode, data => data.get('menu_vo'));
const getMenuItems = createSelector(
  getMenu,
  data =>
    data &&
    data.get('menu_items') &&
    JSON.parse(data.get('menu_items'))
      .filter(item => item.enable)
      .sort((a, b) => {
        return a.order - b.order;
      })
);
const getBroadcastAlbum = createSelector(activityInfoNode, data => data.get('broadcast_album'));
const getActivityDesc = createSelector(activityInfoNode, data => data.get('activity_desc_vo'));

export default state => ({
  envUrls: getUrls(state),
  activityInfo: activityInfoNode(state),
  userInfo: userInfoNode(state),
  activityDesc: getActivityDesc(state),
  startPage: getStartPage(state),
  broadcastActivity: getBroadcastActivity(state),
  banner: getBanner(state),
  menu: getMenu(state),
  menuItems: getMenuItems(state),
  broadcastAlbum: getBroadcastAlbum(state),
  isShowSplashScreen: getIsShowSplashScreen(state),
  isShowBanner: getIsShowBanner(state),
  isLoadCompleted: isLoadCompleted(state),
});
