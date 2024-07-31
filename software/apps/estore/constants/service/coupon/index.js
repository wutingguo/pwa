import { template } from 'lodash';

import {
  ESTORE_COUPON_ADD,
  ESTORE_COUPON_ALLSKU,
  ESTORE_COUPON_EDITCOUPON,
  ESTORE_COUPON_GETCOUPON_DETAIL,
  ESTORE_COUPON_GETCOUPON_LIST,
  ESTORE_COUPON_MANAGECOUPON,
} from '@resource/lib/constants/apiUrl';

import * as xhr from '@resource/websiteCommon/utils/xhr';

const addCoupon = ({ baseUrl, params }) => {
  const url = template(ESTORE_COUPON_ADD)({
    baseUrl,
  });
  return xhr.post(url, params);
};
const getCouponDetail = ({ baseUrl, coupon_id }) => {
  const url = template(ESTORE_COUPON_GETCOUPON_DETAIL)({
    baseUrl,
    coupon_id,
  });
  return xhr.get(url);
};
const editCoupon = ({ baseUrl, params }) => {
  const url = template(ESTORE_COUPON_EDITCOUPON)({
    baseUrl,
  });
  return xhr.post(url, params);
};
const getSkuList = ({ baseUrl, rack_spu_id }) => {
  const url = template(ESTORE_COUPON_ALLSKU)({
    baseUrl,
    rack_spu_id,
  });
  return xhr.get(url);
};

const getCouponList = ({ baseUrl }) => {
  const url = template(ESTORE_COUPON_GETCOUPON_LIST)({
    baseUrl,
  });
  return xhr.get(url);
};
const manageCoupon = ({ baseUrl, params }) => {
  const url = template(ESTORE_COUPON_MANAGECOUPON)({
    baseUrl,
  });
  return xhr.post(url, params);
};

export default {
  addCoupon,
  getSkuList,
  editCoupon,
  getCouponDetail,
  getCouponList,
  manageCoupon,
};
