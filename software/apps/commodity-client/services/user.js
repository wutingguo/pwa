import { template } from 'lodash';
import {
  GET_STORE_CUSTOMER_TOKEN,
  PSTORE_GET_USER_INFO
} from '@resource/lib/constants/apiUrl';
import * as xhr from 'appsCommon/utils/xhr';

export const getStoreUser = async ({ baseUrl, enc_sw_id }) => {
  return new Promise((resolve, reject) => {
    const url = template(PSTORE_GET_USER_INFO)({
      baseUrl: baseUrl,
      enc_sw_id
    });
    xhr.get(url).then(res => {
      resolve(res);
    });
  });
};

export const getStoreCustomerToken = async ({ baseUrl, enc_sw_id }) => {
  return new Promise((resolve, reject) => {
    const url = template(GET_STORE_CUSTOMER_TOKEN)({
      baseUrl: baseUrl,
      enc_sw_id
    });

    xhr.post(url).then(res => {
      const { ret_code, data } = res;
      if (ret_code === 200000) {
        resolve(data);
      }
    }).catch(err => {
      reject(err);
    });
  });
}

