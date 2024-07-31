import Immutable, { fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';

import * as stateHelper from '@apps/gallery/utils/mapStateHelper';

import { getUrl } from '../../../../../resource/lib/saas/image';

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

// 创建可记忆的selector.
const getImageArray = createSelector(imageNode, data => data.imageArray);
const getSelectedImagesObj = createSelector(imageNode, data => data.selectedImages);
const getUploadingImages = createSelector(getSelectedImagesObj, data => data.uploading);
const getUploadingImageStatus = createSelector(getSelectedImagesObj, data => data.status);
const getCollectionsList = createSelector(collection, getUrls, (data, urls) => {
  return stateHelper.getConvertCollectionsList(data, urls);
});
const getCollectionDetail = createSelector(collection, getUrls, (data, urls) => {
  return stateHelper.getCollectionDetail(data, urls);
});
const getCollectionDetailSets = createSelector(getCollectionDetail, detail => {
  return stateHelper.getCollectionDetailSets(detail);
});
const getCollectionPreviewUrl = createSelector(
  getCollectionDetail,
  getUserInfo,
  getUrls,
  getEstoreInfo,
  share,
  (detail, userInfo, urls, estoreInfo, shareData) => {
    return stateHelper.getCollectionPreviewUrl(detail, userInfo, urls, estoreInfo, shareData);
  }
);

// collection -> activities
const getCollectionActivites = createSelector(collection, data => data.activites);

// collection -> activities -> favorite
const getCollectionFavorite = createSelector(
  getCollectionActivites,
  getCollectionDetail,
  (activites, detail) => {
    return stateHelper.transformCollectionFavorite(activites.favorite, detail);
  }
);

// collection -> activities -> download
const getDownloadActivities = createSelector(getCollectionActivites, activites => {
  return activites.download;
});

const getCollectionsSettings = createSelector(collection, getUrls, (data, urls) => {
  return stateHelper.transformCollectionSettings(data, urls);
});

const getCollectionPresetSettings = createSelector(collection, getUrls, (data, urls, preset) => {
  return stateHelper.transformPresetSettings(data, urls);
});

const getDetail = createSelector(collection, getUrls, (data, urls) => {
  return stateHelper.transformDetailData(data, urls);
});
const getPresetDetail = createSelector(collection, getUrls, (data, urls) => {
  return stateHelper.transformPresetDetailData(data, urls);
});
const getPresetCover = createSelector(getPresetDetail, getUrls, (detail, urls) => {
  return stateHelper.transformPresetCoverData(detail, urls);
});
const getCover = createSelector(getDetail, getUrls, (detail, urls) => {
  return stateHelper.transformCoverData(detail, urls);
});

const getEmailTheme = createSelector(share, getUrls, (data, urls) => {
  return stateHelper.transformEmailThemeData(data, urls);
});

const getPinSetting = createSelector(share, data => {
  return data.get('pinSetting');
});

const getShareDirectLink = createSelector(share, data => data.shareDirectLink);

const getUploadParams = createSelector(getCollectionDetail, collectionDetail => {
  if (!collectionDetail || !collectionDetail.size) {
    return {};
  }
  const currentSetUid = collectionDetail.get('currentSetUid');
  const set = collectionDetail.get('default_set');
  return {
    set_uid: currentSetUid,
    watermark_uid: '',
  };
});

const getDefaultImgs = createSelector(getUrls, stateHelper.getDefaultImgs);

const getShowContentLoading = createSelector(getCollectionDetail, detail =>
  detail.get('isShowContentLoading')
);

export default state => {
  const newState = {
    loading: getLoading(state),
    // 图片相关
    imageArray: getImageArray(state),
    selectedImagesObj: getSelectedImagesObj(state),
    uploadingImages: getUploadingImages(state),
    uploadingImageStatus: getUploadingImageStatus(state),
    collectionList: getCollectionsList(state),
    collectionDetail: getCollectionDetail(state),
    collectionDetailSets: getCollectionDetailSets(state),
    collectionsSettings: getCollectionsSettings(state),
    collectionPresetSettings: getCollectionPresetSettings(state),
    collectionFavorite: getCollectionFavorite(state),
    downloadActivities: getDownloadActivities(state),
    coverInfo: getCover(state),
    presetCoverInfo: getPresetCover(state),
    collectionPreviewUrl: getCollectionPreviewUrl(state),
    emailTheme: getEmailTheme(state),
    pinSetting: getPinSetting(state),
    shareDirectLink: getShareDirectLink(state),
    envUrls: getUrls(state),
    defaultImgs: getDefaultImgs(state),

    // 上传的参数
    uploadParams: getUploadParams(state),

    isShowContentLoading: getShowContentLoading(state),
  };
  return newState;
};
