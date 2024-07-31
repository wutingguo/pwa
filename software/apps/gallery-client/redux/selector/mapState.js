import Immutable, { fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';

import * as stateHelper from '@apps/gallery-client/utils/mapStateHelper';

const emptyMap = fromJS({});
const emptyList = fromJS([]);

const rootNode = state => get(state, 'root');
const collectionNode = state => get(state, 'collection');
const guestNode = state => get(state, 'guest');
const favoriteNode = state => get(state, 'favorite.detail');
const storeNode = state => get(state, 'store');
const getEnv = createSelector(rootNode, data => get(data, 'system.env'));

const getUrls = createSelector(getEnv, data => data.urls);

// collection detail
const getDetail = createSelector(collectionNode, data => get(data, 'detail'));

const getDesignSetting = createSelector(getDetail, detail => detail.get('design_setting'));
const getFavoriteSetting = createSelector(getDetail, detail => detail.get('favorite'));
const getCollectionSetting = createSelector(getDetail, detail => detail.get('collection_setting'));
const getIsLoadCollectionCompleted = createSelector(getDetail, detail => {
  return detail.get('isLoadCompleted');
});
const getSelectionSetting = createSelector(getDetail, detail =>
  detail.get('collection_rule_setting')
);
const getIsShareExpired = createSelector(getDetail, detail => {
  return detail.get('isExpired');
});
const getIsNoData = createSelector(getDetail, detail => {
  return detail.get('isNoData');
});
const getCollectionId = createSelector(getDetail, detail => {
  return detail.get('collection_uid');
});
const getCollectionUid = createSelector(getDetail, detail => {
  return detail.get('enc_collection_uid');
});
const getCustomerId = createSelector(getDetail, detail => {
  return detail.get('customer_id');
});
const getDownloadSetting = createSelector(getDetail, detail => {
  return detail.get('download_setting');
});

// 是否需要在预览列表之前, 强制输入email.
const getIsRequiredEmailBeforeViewing = createSelector(
  guestNode,
  getIsLoadCollectionCompleted,
  getCollectionSetting,
  (guest, isLoadCollectionCompleted, collectionSetting) => {
    //需要输入email且没缓存
    const needEmail =
      collectionSetting &&
      !!collectionSetting.get('is_login_email') &&
      // 用户没有输入过email.
      guest &&
      !guest.get('guest_uid');
    //需要输入密码
    const needPassword =
      collectionSetting &&
      !!collectionSetting.get('gallery_password_switch') &&
      // 用户没有输入过密码.
      guest &&
      !guest.get('password_written');
    const collect_type =
      collectionSetting && collectionSetting.get('login_information_config')?.get('collect_type');

    const isShowLoginPage = __isCN__
      ? collect_type === 1 && guest && !guest.get('guest_uid')
      : needEmail;
    return (
      // 项目加载完成.
      isLoadCollectionCompleted && (isShowLoginPage || needPassword)
    );
  }
);

const getConvertDetail = createSelector(collectionNode, getUrls, (detail, urls) => {
  return stateHelper.transformDetailData(detail, urls);
});

const getCover = createSelector(getConvertDetail, getUrls, (detail, urls) => {
  return stateHelper.transformCoverData(detail, urls);
});

/**
 * 强制用户需要输入邮箱时, 显示时用的cover模板.
 */
const getBannerCover = createSelector(getConvertDetail, getUrls, (detail, urls) => {
  // templateid: cover-banner
  return stateHelper.transformCoverData(detail, urls, 'cover-banner');
});

const getSetList = createSelector(getConvertDetail, getUrls, (detail, urls) => {
  const sets = detail.get('sets');
  if (!sets || !sets.size) {
    return emptyList;
  }

  // const designSetting = detail.get('design_setting');
  return sets;
  // images delete
  // return sets.map(set => {
  //   return set.merge(
  //     fromJS({
  //       images: stateHelper.transformSetImages(set, designSetting, urls)
  //     })
  //   );
  // });
});

// images delete
// const getCurrentSet = createSelector(getSetList, sets => {
//   return sets && sets.size ? sets.get(0) : emptyMap;
// });

// images delete
// const getCurrentSetImages = createSelector(
//   getCurrentSet,
//   getDesignSetting,
//   (set, designSetting) => {
//     return stateHelper.transformSetImages(set, designSetting);
//   }
// );

//
const getGuestInfo = createSelector(guestNode, guest => {
  return guest;
});

const getFavoriteInfo = createSelector(favoriteNode, favorite => {
  return favorite;
});

const getFavoriteImageList = createSelector(getFavoriteInfo, favorite => {
  return favorite && favorite.getIn(['favorite_image_list', 'records'])
    ? favorite.getIn(['favorite_image_list', 'records'])
    : fromJS([]);
});

const getCurrentSetImageCount = createSelector(getFavoriteInfo, favorite =>
  favorite.get('currentSetFavoriteImageCount')
);

const getStoreInfo = createSelector(storeNode, store => {
  return store;
});
const getFaceImgs = createSelector(getDetail, detail => {
  return detail.get('faceImgs');
});
export default state => ({
  detail: getDetail(state),
  isLoadCollectionCompleted: getIsLoadCollectionCompleted(state),
  isRequiredEmailBeforeViewing: getIsRequiredEmailBeforeViewing(state),
  isShareExpired: getIsShareExpired(state),
  isNoData: getIsNoData(state),
  designSetting: getDesignSetting(state),
  favoriteSetting: getFavoriteSetting(state),
  collectionSetting: getCollectionSetting(state),
  downloadSetting: getDownloadSetting(state),
  sets: getSetList(state),
  // currentSet: getCurrentSet(state),

  coverInfo: getCover(state),
  coverBannerInfo: getBannerCover(state),
  // currentSetImages: getCurrentSetImages(state),

  guest: getGuestInfo(state),
  favorite: getFavoriteInfo(state),
  favoriteImageList: getFavoriteImageList(state),
  currentSetFavoriteImageCount: getCurrentSetImageCount(state),
  collectionId: getCollectionId(state),
  collectionUid: getCollectionUid(state),
  customerId: getCustomerId(state), //B端创建该collection的用户id
  selectionSetting: getSelectionSetting(state),
  store: getStoreInfo(state),
  faceImgs: getFaceImgs(state),
});
