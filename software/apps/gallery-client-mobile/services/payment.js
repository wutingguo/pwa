import * as xhr from 'appsCommon/utils/xhr';
import { template } from 'lodash';

import {
  ESTORE_GET_STRIPE_PUB_KEY,
  ESTORE_VERIFY_MINIMUM_AMOUNT,
} from '@resource/lib/constants/apiUrl';

export const verifyMinimumAmount = ({ baseUrl, amount, currency }) => {
  return new Promise((resolve, reject) => {
    const url = template(ESTORE_VERIFY_MINIMUM_AMOUNT)({ baseUrl, currency, amount });
    xhr.get(url).then(result => {
      const { ret_code, data = {} } = result;
      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject;
      }
    });
  });
};

export const getStripePubKey = ({ baseUrl, store_id }) => {
  return new Promise((resolve, reject) => {
    const url = template(ESTORE_GET_STRIPE_PUB_KEY)({ baseUrl, store_id });
    xhr.get(url).then(result => {
      const { ret_code, data = {} } = result;
      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject;
      }
    });
  });
};
