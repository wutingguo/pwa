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