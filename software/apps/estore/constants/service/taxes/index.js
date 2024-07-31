import { template } from 'lodash';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import {
  ESTORE_TAX_COUNTRY_AND_PROVINCE,
  ESTORE_TAX_ADD_RATE,
  ESTORE_TAX_UPDATE_RATE,
  ESTORE_TAX_DELETE_RATE,
  ESTORE_TAX_LIST
} from '@resource/lib/constants/apiUrl';
import axios from 'axios';

const addTaxRate = ({
  baseUrl,
  store_id,
  tax_rates,
  tax_usage,
  region_code,
  region_type,
  parent_id,
  apply_digital
}) => {
  const url = template(ESTORE_TAX_ADD_RATE)({
    baseUrl
  });
  const bodyParams = {
    store_id,
    tax_rates,
    tax_usage: Number(tax_usage),
    region_code,
    region_type,
    parent_id,
    apply_digital
  };
  return xhr.post(url, bodyParams);
};

const editTaxRate = ({ baseUrl, store_id, tax_rates, tax_usage, country_code, province_code, apply_digital }) => {
  const url = template(ESTORE_TAX_UPDATE_RATE)({
    baseUrl
  });
  const bodyParams = {
    store_id,
    tax_rates,
    tax_usage: Number(tax_usage),
    country_code,
    province_code, 
    apply_digital
  };
  return xhr.post(url, bodyParams);
};

const removeTaxRate = ({ baseUrl, store_id, country_code, province_code }) => {
  const url = template(ESTORE_TAX_DELETE_RATE)({
    baseUrl,
    store_id,
    country_code,
    province_code
  });
  return axios.delete(url);
};

const taxList = ({ baseUrl, store_id }) => {
  const url = template(ESTORE_TAX_LIST)({
    baseUrl,
    store_id
  });
  return xhr.get(url);
};

const getTaxCountryAndProvince = ({ baseUrl, store_id }) => {
  const url = template(ESTORE_TAX_COUNTRY_AND_PROVINCE)({
    baseUrl,
    store_id
  });
  return xhr.get(url);
};

export default {
  addTaxRate,
  editTaxRate,
  removeTaxRate,
  taxList,
  getTaxCountryAndProvince
};
