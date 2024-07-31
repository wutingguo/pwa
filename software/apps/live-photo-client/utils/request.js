import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from './getDataFromState';

/**
 * @param {string} url 请求地址
 * @param {string} method 请求方法
 * @param {object} headers 请求头
 * @param {object} bodyParams POST请求的body
 */
const request = ({ url, method = 'GET', headers = {}, bodyParams = {} }) => {
  const options = { method, headers };
  if (!headers['Content-type']) {
    headers['Content-type'] = 'application/json; charset=UTF-8';
  }
  if (method === 'POST') {
    options.body = JSON.stringify(bodyParams);
  }
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { baseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: url,
            params: {
              baseUrl
            }
          },
          options
        }
      }).then(resolve, reject);
    });
  };
};

export default request;
