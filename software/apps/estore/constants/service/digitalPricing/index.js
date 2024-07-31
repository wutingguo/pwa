import { template } from 'lodash';

import {
  ESTORE_CHECK_DIGITAL_EXISTED,
  ESTORE_GET_CUSTOMER_SKU_LIST,
  ESTORE_GET_CUSTOMER_SPU_ATTRS,
  ESTORE_GET_CUSTOMER_SPU_DETAIL,
  ESTORE_GET_PRODUCT_TEMPLATE,
} from '@resource/lib/constants/apiUrl';

import * as xhr from '@resource/websiteCommon/utils/xhr';

const parseBack = promiseBack => {
  return new Promise((resolve, reject) => {
    promiseBack
      .then(res => {
        const { data, ret_code, ret_msg } = res;
        if (ret_code == 200000) {
          resolve(data);
        } else {
          reject(ret_msg);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

const getDigitalProductTemplate = ({ baseUrl, category_code = 'Digital', product_type = 4 }) => {
  const url = template(ESTORE_GET_PRODUCT_TEMPLATE)({
    baseUrl,
    category_code,
    product_type,
  });
  return parseBack(xhr.get(url));
};

const getDigitalSpuAttrs = ({ baseUrl, spu_uuid }) => {
  const url = template(ESTORE_GET_CUSTOMER_SPU_ATTRS)({
    baseUrl,
    spu_uuid,
  });
  return parseBack(xhr.get(url));
};

const getDigitalSpuList = ({ baseUrl, rack_spu_id }) => {
  const url = template(ESTORE_GET_CUSTOMER_SKU_LIST)({
    baseUrl,
    rack_spu_id,
  });
  return parseBack(xhr.get(url));
};

const getDigitalSpuDetail = ({ baseUrl, rack_spu_id }) => {
  const url = template(ESTORE_GET_CUSTOMER_SPU_DETAIL)({
    baseUrl,
    rack_spu_id,
  });
  return parseBack(xhr.get(url));
};

const checkDigitalExisted = ({ baseUrl, rack_id }) => {
  const url = template(ESTORE_CHECK_DIGITAL_EXISTED)({
    baseUrl,
    rack_id,
  });
  return parseBack(xhr.get(url));
};

export default {
  getDigitalProductTemplate,
  getDigitalSpuAttrs,
  getDigitalSpuList,
  getDigitalSpuDetail,
  checkDigitalExisted,
};
