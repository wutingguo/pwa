import qs from 'qs';

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
    return `${addStart?'?':'&'}${paramsArr.join('&')}`;
  }
  return '';
}

export function getQueryStringObj() {
  return qs.parse(window.location.search.substr(1));
}


export function pushState(params) {
  const searchObj = qs.parse(window.location.search.substr(1));
  const newParams = Object.assign({}, searchObj, params);
  const searchStr = buildUrlParmas(newParams);
  const url = `${searchStr}`;
  history.pushState(null, null, url);
}
