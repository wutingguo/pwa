import qs from 'qs';
import { pick } from 'lodash';

export const getQs = name => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return r[2];
  }
  return null;
};

/**
 * 根据对象生成url查询参数
 * @param {object} obj 待生成查询参数的对象
 * @returns {string} url查询参数字符串
 */
export const buildUrlParmas = (obj, addStart = true) => {
  let paramsArr = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      paramsArr.push(`${key}=${encodeURIComponent(obj[key])}`);
    }
  }
  if (paramsArr.length) {
    return `${addStart ? '?' : '&'}${paramsArr.join('&')}`;
  }
  return '';
};

export function getQueryStringObj() {
  return qs.parse(window.location.search.substr(1));
}

/**
 * 根据对象生成url查询参数JSON
 */
export const buildUrlParmasJSON = (currentOptions, selectionList) => {
  let paramsJSON = {};
  const valuesMap = Object.values(currentOptions);
  const transferKeys = selectionList.filter(i => !i.is_key).map(i => i.option_key);

  valuesMap.forEach(item => {
    const add = pick(item, transferKeys) || {};
    // 日历摆台，要带入主题参数
    if (item.product === 'PC_SIMPLEDESKCALENDAR') {
      add.applyBookThemeId = 'ef94a8b3-d51d-482a-b0dd-0ab4f72fd48a';
    }
    if (item.productKey && add) {
      paramsJSON[item.productKey] = add;
    }
  });
  if (paramsJSON) {
    return `&paramsJSON=${encodeURIComponent(JSON.stringify(paramsJSON))}`;
  }
  return '';
};

// 根据价格计算器的currentOptions,组装url
export const buildOptionsDefaultJSON = (currentOptions, selectionList = []) => {
  let defaultValue = null;

  /**
   1、is_key 为true是进入sku的属性 不需要传递
   2、is_show 为true是界面上可以供用户选择的属性
   3、is_key为false并且is_show为true的属性需要带入编辑器
   */
  const addKeys = selectionList.reduce((a, item) => {
    const { option_key, is_key, is_show } = item;
    if ((is_show && !is_key) || (is_key && is_show)) {
      a.push(option_key);
    }
    return a;
  }, []);

  // TODO
  //defaultValue 中必须要要包含一个product节点, 在初始价格计算器时会用到

  addKeys.push('product');
  const valuesMap = Object.values(currentOptions);
  valuesMap.forEach(item => {
    const add = pick(item, addKeys) || null;
    if (item.productKey && add) {
      if (!defaultValue) {
        defaultValue = {};
      }
      defaultValue = add;
    }
  });

  if (defaultValue) {
    return `defaultValue=${encodeURIComponent(JSON.stringify(defaultValue))}`;
  }

  return '';
};

export function pushState(params) {
  const searchObj = qs.parse(window.location.search.substr(1));
  const newParams = Object.assign({}, searchObj, params);
  const searchStr = buildUrlParmas(newParams);
  const url = `${searchStr}`;
  history.pushState(null, null, url);
}

export function isHttpUrl(url) {
  return /^https?:/.test(url);
}
