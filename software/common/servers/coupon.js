import { template } from 'lodash';

import * as xhr from '@resource/websiteCommon/utils/xhr';

import { APPLY_COUPON_IN_CLIENT } from '@common/constants/apiUrl';

export const applyCouponInClient = ({ baseUrl, coupon_code }) => {
  return new Promise(resolve => {
    const url = template(APPLY_COUPON_IN_CLIENT)({
      baseUrl,
      coupon_code,
    });
    xhr.get(url).then(res => {
      let errMsg = '';
      if (res.data) {
        const {
          validation_rsp: { code, minimum_amount },
          shopping_cart_vo: { currency },
        } = res.data;
        if (code === 500864) {
          errMsg = "The coupon code doesn't exist or is invalid.";
        } else if (code === 500865) {
          errMsg = 'The coupon code is expired.';
        } else if (code === 500866) {
          errMsg = 'The coupon code is scheduled, not yet active.';
        } else if (code === 500867) {
          const { symbol = '' } = currency || {};
          errMsg = `The coupon code requires minimum order amount of ${symbol}${minimum_amount}`;
        } else if (code === 500868) {
          errMsg = 'The coupon code is not applicable to any items in the cart.';
        }
        resolve({
          code,
          errMsg,
        });
      }
      resolve({
        errMsg,
      });
    });
  });
};
