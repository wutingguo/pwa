import * as xhr from '@resource/websiteCommon/utils/xhr';

const requrest = (params, type = 'get', options) => {
  const { hasManageError = true } = options || {};
  return new Promise((resolve, reject) => {
    const { url, data } = params;
    xhr[type](url, data, options).then(result => {
      const { ret_code, data = {}, ret_msg } = result;
      if (ret_code === 200000 || !hasManageError) {
        resolve(data);
      } else {
        reject({ ret_msg, ret_code });
      }
    });
  });
};

export default requrest;
