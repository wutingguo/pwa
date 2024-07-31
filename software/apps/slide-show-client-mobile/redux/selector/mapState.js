import Immutable, { fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';
import * as stateHelper from '@apps/slide-show-client-mobile/utils/mapStateHelper';
import { transformCoverData } from '@resource/lib/saas/mapStateHelper';

const emptyMap = fromJS({});
const emptyList = fromJS([]);

const rootNode = state => get(state, 'root');
const collection = state => get(state, 'collection');
const postcard = state => get(state, 'postcard');
const getEnv = createSelector(rootNode, data => get(data, 'system.env'));
const guestNode = state => get(state, 'guest');

const getUrls = createSelector(getEnv, data => data.urls);

// collection detail
const getCollectionDetail = createSelector(collection, getUrls, (data, urls) => {
  return stateHelper.getCollectionDetail(data, urls);
});

const getIsLoadCollectionCompleted = createSelector(getCollectionDetail, detail => {
  return detail.get('isLoadCompleted');
});

const getIsNoData = createSelector(getCollectionDetail, detail => {
  return detail.get('isNoData');
});

const getPostCardList = createSelector(postcard, data => {
  return stateHelper.getPostCardList(data);
});
const getConvertDetail = createSelector(collection, getUrls, (detail, urls) => {
  return stateHelper.transformDetailData(detail, urls);
});
/**
 * 强制用户需要输入邮箱时, 显示时用的cover模板.
 */
const getBannerCover = createSelector(getConvertDetail, getUrls, (detail, urls) => {
  // templateid: cover-banner
  return transformCoverData(detail, urls, 'cover-banner');
});

const getUsedPostCardDetail = createSelector(postcard, getUrls, (data, urls) => {
  return stateHelper.getUsedPostCardDetail(data, urls);
});
// 是否需要在预览列表之前, 强制输入密码
const getIsRequiredPasswordBeforeViewing = createSelector(
  getIsLoadCollectionCompleted,
  getCollectionDetail,
  guestNode,
  (isLoadCollectionCompleted, collectionDetail, guestNode) => {
    //需要输入密码
    const needPassword =
      collectionDetail &&
      !!collectionDetail.get('slideshow_password_switch') &&
      !guestNode.get('password_written');
    return (
      // 项目加载完成.
      isLoadCollectionCompleted && needPassword
    );
  }
);

export default state => ({
  detail: getCollectionDetail(state),
  isLoadCollectionCompleted: getIsLoadCollectionCompleted(state),
  isNoData: getIsNoData(state),
  postCardList: getPostCardList(state),
  usedPostCardDetail: getUsedPostCardDetail(state),
  isRequiredPosswordBeforeViewing: getIsRequiredPasswordBeforeViewing(state),
  coverBannerInfo: getBannerCover(state)
});
