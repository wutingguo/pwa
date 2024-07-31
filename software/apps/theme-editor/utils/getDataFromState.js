import Immutable from 'immutable';
import { get } from 'lodash';
import * as stateHelper from '@apps/theme-editor/utils/mapStateHelper';
import { isImmutable } from '@resource/lib/utils/compare';

const emptyList = Immutable.fromJS([]);
export const getElementPageIdMap = pageArray => {
  let elementPageIdMap = Immutable.Map();

  pageArray.forEach(page => {
    page.get('elements').forEach(element => {
      elementPageIdMap = elementPageIdMap.set(element.get('id'), page.get('id'));
    });
  });

  return elementPageIdMap;
};

export const getCurrentPage = (pageArray, pageId) => {
  const page = pageArray.find(page => page.get('id') === pageId);
  if (page) {
    return page;
  }

  return null;
};

const getPresentProjects = theme => {
  let presentProjects = {};

  const { pageArray } = theme;

  presentProjects = {
    ...theme,
    pageArray: get(pageArray, 'present')
  };
  return presentProjects;
};

/**
 * 获取项目的elements集合
 * @param {*} project
 * @param {*} pageId 待获取元素的pageid, 如果没有传, 就获取整个项目的elements.
 */
export const getElementArray = (pageArray, pageId) => {
  let elementArray = emptyList;

  if (pageId) {
    const currentPage = pageArray.find(m => m.get('id') === pageId);
    if (currentPage) {
      elementArray = currentPage.get('elements');
    }
  } else {
    // 内页
    if (pageArray && pageArray.size) {
      pageArray.forEach(m => {
        elementArray = elementArray.concat(m.get('elements'));
      });
    }
  }

  return elementArray;
};

export default state => {
  const { root, slideshow, theme } = state;
  const { system } = root;
  const urls = stateHelper.getUrlsHelper(get(system, 'env.urls'));
  const studioInfo = get(system, 'studioInfo');
  const studioList = studioInfo.get('studioList') || [];
  const studio = studioList.length > 0 ? studioList[0] : {};
  const { pagination } = theme;
  const presentTheme = getPresentProjects(theme);
  const pageArray = presentTheme.pageArray;
  const elementArray = getElementArray(pageArray);
  const title = theme.property.get('title');

  return {
    qs: get(system, 'env.qs'),
    urls,
    baseUrl: urls.get('baseUrl'),
    galleryBaseUrl: urls.get('galleryBaseUrl'),
    uploadBaseUrl: urls.get('uploadBaseUrl'),
    userInfo: get(system, 'userInfo'),
    studio,
    slideshow,
    pageArray,
    elementArray,
    title,
    pagination
  };
};
