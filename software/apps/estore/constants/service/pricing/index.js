import { template } from 'lodash';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import {
  ESTORE_GET_RACK_SKU_LIST,
  ESTORE_GET_RACK_SPU_DETAIL,
  ESTORE_LIST_ATTR_BY_SPU,
  ESTORE_LIST_SPU_BY_UUID,
  ESTORE_GET_SUPPLIER_SPU_DETAIL,
  ESTORE_CHANGE_CARRIER_SUPPLIER_SPU,
  ESTORE_MANAGER_OPTION,
  ESTORE_APPLY_MARKUP,
} from '@resource/lib/constants/apiUrl';

const getRackSkuList = ({ baseUrl, rack_spu_id }) => {
  const url = template(ESTORE_GET_RACK_SKU_LIST)({
    baseUrl,
    rack_spu_id
  });
  return xhr.get(url);
};

const getRackSpuDetail = ({ baseUrl, rack_spu_id }) => {
  const url = template(ESTORE_GET_RACK_SPU_DETAIL)({
    baseUrl,
    rack_spu_id
  });
  return xhr.get(url);
};

const listAttrBySpu = ({ baseUrl, spu_uuid }) => {
  const url = template(ESTORE_LIST_ATTR_BY_SPU)({
    baseUrl,
    spu_uuid
  });
  return xhr.get(url);
};

const listSpuByUuid = ({ baseUrl, spu_uuid }) => {
  const url = template(ESTORE_LIST_SPU_BY_UUID)({
    baseUrl,
    spu_uuid
  });
  return xhr.get(url);
};

const getSupplierSpuDetail = ({ baseUrl, spu_uuid }) => {
  const url = template(ESTORE_GET_SUPPLIER_SPU_DETAIL)({
    baseUrl,
    spu_uuid
  });
  return xhr.get(url);
};

/**
 * 切换供应商spu
 * @param {*} param0 
 * @returns 
 */
const changeCarrierSupplierSpu = ({ baseUrl, store_id, rack_spu_id, spu_uuid }) => {
  const url = template(ESTORE_CHANGE_CARRIER_SUPPLIER_SPU)({
    baseUrl
  });
  const bodyParams = {
    store_id,
    rack_spu_id,
    spu_uuid
  };
  return xhr.post(url, bodyParams);
};


/**
 * manager Option
 * @param {*} param0 
 * @returns 
 */
 const managerOption = ({ baseUrl, store_id, rack_spu_id, rack_id, options }) => {
  const url = template(ESTORE_MANAGER_OPTION)({
    baseUrl
  });
  const bodyParams = {
    store_id,
    rack_spu_id,
    rack_id,
    options
  };
  return xhr.post(url, bodyParams);
};

/**
 * manager Option
 * @param {*} param0 (type:"PERCENT | AMOUNT",)
 * @returns 
 */
 const applyMarkup = ({ baseUrl, type, rack_spu_id, percent_param={}, amount_param=[]}) => {
  const url = template(ESTORE_APPLY_MARKUP) ({
    baseUrl
  });
  /**
   * AMOUNT表示直接设置价格（对应UI中单个价格的设置），PERCENT 表示通过设置比例（对应UI中的apply bulk markup）
   * 当type=PERCENT时 percent_param, 当type= AMOUNT时 设置amount_param
   */
  const bodyParams = {
    rack_spu_id,
    type,
    percent_param,
    amount_param 
  };
  return xhr.post(url, bodyParams);
};
export default {
  getRackSkuList,
  getRackSpuDetail,
  listAttrBySpu,
  listSpuByUuid,
  getSupplierSpuDetail,
  changeCarrierSupplierSpu,
  managerOption,
  applyMarkup
};
