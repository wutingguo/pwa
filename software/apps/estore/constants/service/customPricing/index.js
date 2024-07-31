import { template } from 'lodash';
import * as xhr from '@resource/websiteCommon/utils/xhr';

import {
  ESTORE_LIST_CATEGORY_BY_PARENT,
  ESTORE_GET_SIGN,
  ESTORE_ADD_CUSTOMER_SPU,
  ESTORE_GET_CUSTOMER_SPU_DETAIL,
  ESTORE_GET_CUSTOMER_SKU_LIST,
  ESTORE_GET_CUSTOMER_SPU_ATTRS,
  ESTORE_GET_IMAGE_URL,
  ESTORE_GET_IMAGE_URLS,
  ESTORE_DELETE_PRODUCT
} from '@resource/lib/constants/apiUrl';

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

const getCustomCategoryList = ({ baseUrl, parent_id = 0 }) => {
  const url = template(ESTORE_LIST_CATEGORY_BY_PARENT)({
    baseUrl,
    parent_id
  });
  return parseBack(xhr.get(url));
};

const getCustomerSpuAttrs = ({ baseUrl, spu_uuid }) => {
  const url = template(ESTORE_GET_CUSTOMER_SPU_ATTRS)({
    baseUrl,
    spu_uuid
  });
  return parseBack(xhr.get(url));
};

const getCustomerSpuList = ({ baseUrl, rack_spu_id }) => {
  const url = template(ESTORE_GET_CUSTOMER_SKU_LIST)({
    baseUrl,
    rack_spu_id
  });
  return parseBack(xhr.get(url));
};

const getCustomerSpuDetail = ({ baseUrl, rack_spu_id }) => {
  const url = template(ESTORE_GET_CUSTOMER_SPU_DETAIL)({
    baseUrl,
    rack_spu_id
  });
  return parseBack(xhr.get(url));
};

const getFetchUploadUrl = ({ baseUrl, upload_files = [] }) => {
  const url = template(ESTORE_GET_SIGN)({
    baseUrl
  });
  const bodyParams = {
    upload_file_params: upload_files.map(item => ({
      ...item,
      media_type: 1
    }))
  };
  return parseBack(xhr.post(url, bodyParams));
};

const addCustomerSpu = ({ baseUrl, params }) => {
  const url = template(ESTORE_ADD_CUSTOMER_SPU)({
    baseUrl
  });
  const bodyParams = {
    ...params
  };
  return parseBack(xhr.post(url, bodyParams));
};

const getImageUrl = ({ baseUrl, asset_uuid }) => {
  const url = template(ESTORE_GET_IMAGE_URL)({
    baseUrl,
    asset_uuid
  });
  return parseBack(xhr.get(url));
};
const getImageUrls = ({ baseUrl, asset_uuids }) => {
  const url = template(ESTORE_GET_IMAGE_URLS)({
    baseUrl,
    asset_uuids
  });
  return parseBack(xhr.get(url));
};

const deleteProductFromCustom = ({ baseUrl, rack_spu_id }) => {
  const url = template(ESTORE_DELETE_PRODUCT)({
    baseUrl
  });
  const bodyParams = {
    rack_spu_id
  };
  return parseBack(xhr.post(url, bodyParams));
};

export default {
  getCustomCategoryList,
  getFetchUploadUrl,
  addCustomerSpu,
  getCustomerSpuDetail,
  getCustomerSpuAttrs,
  getCustomerSpuList,
  getImageUrl,
  getImageUrls,
  deleteProductFromCustom
};
