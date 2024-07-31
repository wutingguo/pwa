import _ from 'lodash';
import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from './getDataFromState';
import { getUrl } from '@resource/lib/saas/image';

/**
 * @param {string} url 请求地址
 * @param {string} method 请求方法
 * @param {object} headers 请求头
 * @param {object} bodyParams POST请求的body 
 */
const request = ({ 
  url, 
  method = 'GET', 
  headers = {}, 
  bodyParams = {}, 
  query = {}, 
  loadingType, 
  showLoading, 
  hideLoading 
}) => {
  const options = { method, headers };

  if (!headers['Content-type']) {
    headers['Content-type'] = 'application/json; charset=UTF-8';
  }
  if (method === 'POST') {
    options.body = JSON.stringify(bodyParams);
  }
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      showLoading && showLoading();
      const { galleryBaseUrl } = getDataFromState(getState());
      
      return dispatch({
        [CALL_API]: {
          apiPattern: {
            name: getUrl(url, query),
            params: {
              galleryBaseUrl
            }
          },
          options,
          loadingType
        }
      }).then((res) => {
        hideLoading && hideLoading();
        return resolve(res, {dispatch, getState});
      }, (error) => {
        hideLoading && hideLoading();
        return reject(error);
      });
    })
  }
}

export default request;