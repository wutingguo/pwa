import { get } from 'lodash';
import { save } from '@resource/pwa/services/slideshow';
import getDataFromState from '@apps/slide-show/utils/getDataFromState';

let timer;

/**
 * 将项目格式化成可以保存的数据结构.
 * @param {*} project 
 */
const formatSlidshowBody = project => {
  const detail = get(project, 'collection.detail');
  if (!detail) {
    return {};
  }

  return detail.toJS();
};

/**
 * 每5秒保存一次. 
 * 防抖: 完成后再统一发送请求，最后一个人说了算 只认最后一次
 * @param {*} store 
 */
const autoSavingAction = (store) => {
  clearTimeout(timer);

  timer = setTimeout(() => {
    const { getState } = store;
    const { galleryBaseUrl, slideshow } = getDataFromState(getState());
    const body = formatSlidshowBody(slideshow);

    save(body, galleryBaseUrl)
  }, 2000);
};

const autoSave = store => next => action => {
  const { _AUTO_Saving } = action;
  if(_AUTO_Saving){
    autoSavingAction(store);
  }

  return next(action);
};

export default autoSave;