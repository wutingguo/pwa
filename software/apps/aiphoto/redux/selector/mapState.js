import { fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';
import * as stateHelper from '@apps/aiphoto/utils/mapStateHelper';

const systemNode = state => get(state, 'root.system');
const rootNode = state => get(state, 'root');
const getLoading = state => get(state, 'root.loading');
const collection = state => get(state, 'aiphoto.collection');
const effects = state => get(state, 'aiphoto.effects');
const category = state => get(state, 'aiphoto.category');
const imageNode = state => get(state, 'gallery.images');

const getEnv = createSelector(rootNode, data => get(data, 'system.env'));

const getUrls = createSelector(getEnv, data => data.urls);

const getCollectionsList = createSelector(collection, getUrls, (data, urls) => {
  return stateHelper.getConvertCollectionsList(data, urls);
});
const getCollectionDetail = createSelector(collection, getUrls, (data, urls) => {
  return stateHelper.getCollectionDetail(data, urls);
});

const getDefaultImgs = createSelector(getUrls, stateHelper.getDefaultImgs);

const getShowContentLoading = createSelector(getCollectionDetail, detail =>
  detail.get('isShowContentLoading')
);

const getEffectsList = createSelector(effects, getUrls, (data, urls) => {
  return stateHelper.getConvertEffectsList(data, urls);
});

const getCategoryList = createSelector(category, getUrls, (data, urls) => {
  return stateHelper.getConvertEffectsList(data, urls);
});

const getSelectedImagesObj = createSelector(imageNode, data => data.selectedImages);

const getUploadingImages = createSelector(getSelectedImagesObj, data => data.uploading);

export default state => {
  const newState = {
    loading: getLoading(state),
    // 图片相关
    collectionList: getCollectionsList(state),
    effectsList: getEffectsList(state),
    categoryList: getCategoryList(state),
    collectionDetail: getCollectionDetail(state),
    envUrls: getUrls(state),
    defaultImgs: getDefaultImgs(state),
    isShowContentLoading: getShowContentLoading(state),
    uploadingImages: getUploadingImages(state)
  };
  return newState;
};
