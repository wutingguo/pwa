import { template } from 'lodash';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import {
  ESTORE_SHIPPING_COUNTRY_AND_PROVINCE,
  ESTORE_ADD_SHIPPING,
  ESTORE_GET_SHIPPING_LIST,
  ESTORE_DELETE_SHIPPING,
  ESTORE_UPDATE_SHIPPING
} from '@resource/lib/constants/apiUrl';

const addShipping = ({ baseUrl, store_id, ship_method, flat_fee, region_type, region_code }) => {
  const url = template(ESTORE_ADD_SHIPPING)({
    baseUrl
  });
  const bodyParams = {
    store_id,
    ship_method,
    flat_fee: Number(flat_fee),
    region_type,
    region_code: region_type == 0 ? '' : region_code
  };
  return xhr.post(url, bodyParams);
};

const updateShipping = ({
  baseUrl,
  id,
  store_id,
  ship_method,
  flat_fee,
  region_type,
  region_code
}) => {
  const url = template(ESTORE_UPDATE_SHIPPING)({
    baseUrl
  });
  const bodyParams = {
    id,
    store_id,
    ship_method,
    flat_fee: Number(flat_fee),
    region_type,
    region_code: region_type == 0 ? '' : region_code
  };
  return xhr.post(url, bodyParams);
};

const deleteShipping = ({ baseUrl, shipping_method_id }) => {
  const url = template(ESTORE_DELETE_SHIPPING)({
    baseUrl
  });
  const bodyParams = {
    shipping_method_id
  };
  return xhr.post(url, bodyParams);
};
const shippingList = ({ baseUrl, store_id, fulfill_type = 2 }) => {
  const url = template(ESTORE_GET_SHIPPING_LIST)({
    baseUrl,
    store_id,
    fulfill_type
  });
  return xhr.get(url);
};

const getShippingCountryAndProvince = ({ baseUrl }) => {
  const url = template(ESTORE_SHIPPING_COUNTRY_AND_PROVINCE)({
    baseUrl
  });
  return xhr.get(url);
};

export default {
  addShipping,
  updateShipping,
  deleteShipping,
  shippingList,
  getShippingCountryAndProvince
};
