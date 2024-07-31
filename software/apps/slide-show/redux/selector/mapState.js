import Immutable, { fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';
import * as stateHelper from '@apps/slide-show/utils/mapStateHelper';

const emptyArr = fromJS([]);
const emptyMap = fromJS({});

const rootNode = state => get(state, 'root');
const systemNode = state => get(state, 'root.system');
const getLoading = state => get(state, 'root.loading');
const projectNode = state => get(state, 'slideshow');
const imageNode = state => get(state, 'slideshow.images');
const collection = state => get(state, 'slideshow.collection');
const share = state => get(state, 'slideshow.share');
const musics = state => get(state, 'slideshow.musics');
const transitionModes = state => get(state, 'slideshow.transitionModes');
const myPhotos = state => get(state, 'root.myPhotos');
const mySubscription = state => get(state, 'root.system.mySubscription');
const postcard = state => get(state, 'slideshow.postcard');

const getEnv = createSelector(rootNode, data => get(data, 'system.env'));
const getStudioInfo = createSelector(rootNode, data => get(data, 'system.studioInfo'));

const getUrls = createSelector(getEnv, data => {
  return stateHelper.getUrlsHelper(data.urls);
});

// 订阅是否达到容量
const getStorageStatus = createSelector(mySubscription, subscription =>
  stateHelper.getStorageStatus(subscription)
);

// 图片相关的
const getImageArray = createSelector(imageNode, data => data.imageArray);
const getSelectedImagesObj = createSelector(imageNode, data => data.selectedImages);
const getUploadingImages = createSelector(getSelectedImagesObj, data => data.uploading);
const getUploadingImageStatus = createSelector(getSelectedImagesObj, data => data.status);

const getMyPhotos = createSelector(myPhotos, items => items);

const getCollectionList = createSelector(
  collection,
  mySubscription,
  getUrls,
  (data, level, getUrls) => {
    return stateHelper.getCollectionList(data, level, getUrls);
  }
);

const getCollectionDetail = createSelector(collection, getUrls, getStudioInfo, (data, urls, studioInfo) => {
  return stateHelper.getCollectionDetail(data, urls, studioInfo);
});

const getPostCardList = createSelector(postcard, data => {
  return stateHelper.getPostCardList(data);
});
const getPostCardDetail = createSelector(postcard, getUrls, (data, urls) => {
  return stateHelper.getPostCardDetail(data, urls);
});

const getUsedPostCardDetail = createSelector(postcard, getUrls, (data, urls) => {
  return stateHelper.getUsedPostCardDetail(data, urls);
});

const getShareDirectLink = createSelector(share, data => data.shareDirectLink);

const getUploadParams = createSelector(getCollectionDetail, collectionDetail => {
  if (!collectionDetail || !collectionDetail.size) {
    return {};
  }
  const currentSetUid = collectionDetail.get('id');
  return {
    project_id: currentSetUid,
    watermark_uid: ''
  };
});

const getShowContentLoading = createSelector(getCollectionDetail, detail =>
  detail.get('isShowContentLoading')
);

// 音乐相关.
const getMusicCategories = createSelector(musics, data => {
  return get(data, 'music.categories') || emptyArr;
});
const getMusicFavorite = createSelector(musics, data => {
  return get(data, 'music.favorites') || emptyMap;
});
const getMusicList = createSelector(musics, data => {
  return get(data, 'music.musics') || emptyMap;
});
const getTransitionModes = createSelector(transitionModes, data => data);
const getMusicTags = createSelector(musics, data => {
  return get(data, 'music.tags') || emptyArr;
});

// 音波图
const getCurrentSegment = createSelector(getCollectionDetail, getUrls, (detail, urls) => {
  return stateHelper.getCurrentSegment(detail, urls);
});

// 获取邮件分享主题
const getEmailTheme = createSelector(share, getUrls, (data, urls) => {
  return stateHelper.transformEmailThemeData(data, urls);
});

export default state => {
  const newState = {
    loading: getLoading(state),

    collectionList: getCollectionList(state),
    collectionDetail: getCollectionDetail(state),

    // 音乐相关.
    musicCategories: getMusicCategories(state),
    musicFavorite: getMusicFavorite(state),
    musicList: getMusicList(state),
    musicTags: getMusicTags(state),

    // 图片相关
    imageArray: getImageArray(state),
    selectedImagesObj: getSelectedImagesObj(state),
    uploadingImages: getUploadingImages(state),
    uploadingImageStatus: getUploadingImageStatus(state),
    myPhotos: getMyPhotos(state),

    shareDirectLink: getShareDirectLink(state),
    emailTheme: getEmailTheme(state),
    urls: getUrls(state),

    // 上传的参数
    uploadParams: getUploadParams(state),

    isShowContentLoading: getShowContentLoading(state),

    // 音波图
    currentSegment: getCurrentSegment(state),

    // 订阅容量状态 true-达到容量， false-未达到
    storageStatus: getStorageStatus(state),

    transitionModes: getTransitionModes(state),
    postCardList: getPostCardList(state),
    postCardDetail: getPostCardDetail(state),
    usedPostCardDetail: getUsedPostCardDetail(state)
  };
  return newState;
};
