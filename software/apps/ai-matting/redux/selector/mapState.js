import Immutable, { fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';
import * as stateHelper from '@apps/ai-matting/utils/mapStateHelper';

const emptyArr = fromJS([]);
const emptyMap = fromJS({});

const rootNode = state => get(state, 'root');
const systemNode = state => get(state, 'root.system');
const getLoading = state => get(state, 'root.loading');
const aiMattingNode = state => get(state, 'aiMatting');


const getEnv = createSelector(rootNode, data => get(data, 'system.env'));
const getUrls = createSelector(getEnv, data => {
  return stateHelper.getUrlsHelper(data.urls);
});

const getImages = createSelector(aiMattingNode, node => get(node, 'images'))
const getProperty = createSelector(aiMattingNode, node => get(node, 'property'))
const getRenderData = createSelector(aiMattingNode, node => get(node, 'renderData'))
const getRatio = createSelector(getRenderData, renderData => renderData.get('ratio'))
const getPage = createSelector(aiMattingNode, node => get(node, 'page'))
const getPresentPage = createSelector(getPage, page => page.present)


export default state => {
  const newState = {
    loading: getLoading(state),
    urls: getUrls(state),
    images: getImages(state),
    property: getProperty(state),
    ratio: getRatio(state),
    page: getPresentPage(state)
  };
  return newState;
};
