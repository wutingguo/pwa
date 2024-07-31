import { template } from 'lodash';
import * as xhr from 'appsCommon/utils/xhr';
import { getWWWorigin } from '@resource/lib/utils/url';
import { LOG_OUT, GET_USER_INFO, GET_MY_ACCOUNT_USER_INFO } from '@resource/lib/constants/apiUrl';


const getUserInfo = () => {
  return xhr.get(template(GET_USER_INFO)({ baseUrl: getWWWorigin(), autoRandomNum: Date.now() }))
}

const getMyAccountUserInfo = () => {
  return xhr.get(template(GET_MY_ACCOUNT_USER_INFO)({ baseUrl: getWWWorigin(), autoRandomNum: Date.now() }))
    .then(result => {
      const { ret_code, data } = result || {};
      if (ret_code == 200000) {
        return Promise.resolve(data);
      } else {
        return Promise.reject(ret_code);
      }
    })
}

const sigout = (baseUrl) => {
  const url = template(LOG_OUT)({
    baseUrl
  });
  return new Promise((resolve, reject) => {
    xhr.post(url).then(res => {
      if(res && res.ret_code === 200000) {
        return resolve()
      }
      return reject();

    }).catch(e =>{
      return reject(e);
    })

  });
};

export {
  sigout,
  getUserInfo,
  getMyAccountUserInfo
}

