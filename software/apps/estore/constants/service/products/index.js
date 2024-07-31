import { template } from 'lodash';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import {
  ESTORE_GET_RACK_SPU_LIST,
  ESTORE_RACK_GET_LIST,
  ESTORE_ADD_RACK,
  GET_FULFILL_TYPE,
  ESTORE_SAVE_SETTING,
  ESTORE_GET_OPTION_SPACE,
  ESTORE_GET_USER_INFO,
  ESTORE_LOGIN_IN,
  ESTORE_MODIFY_SPU_STATUS,
  ESTORE_DEL_RACK,
  ESTORE_GET_RACK_SPU_LIST_B,
  ESTORE_EXISTS_BINDED,
  ESTORE_LIST_COLLECTION_INFOS,
  ESTORE_BIND_COLLECTION
} from '@resource/lib/constants/apiUrl';

const estoreAddRack = ({ baseUrl, rack_name, fulfill_type, supplier_id, store_id }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_ADD_RACK)({
    baseUrl: cloudapiUrl
  });
  const bodyParams = {
    rack_name,
    fulfill_type,
    supplier_id,
    store_id
  };
  return xhr.post(url, bodyParams);
};

const estoreGetList = ({ baseUrl, store_id }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_RACK_GET_LIST)({
    baseUrl: cloudapiUrl,
    store_id
  });
  return xhr.get(url);
};
const estoreGetUserInfo = ({ baseUrl }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_GET_USER_INFO)({
    baseUrl: cloudapiUrl
  });
  return xhr.get(url);
};

const estoreGetOptionList = ({ baseUrl, root_spu_uid, product_list }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_GET_OPTION_SPACE)({
    baseUrl: cloudapiUrl
  });
  const bodyParams = {
    root_spu_uid,
    product_list
  };
  return xhr.post(url, bodyParams);
};

const estoreDelRack = ({ baseUrl, rack_id, store_id }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_DEL_RACK)({
    baseUrl: cloudapiUrl
  });
  const bodyParams = {
    rack_id,
    store_id
  };
  return xhr.post(url, bodyParams);
};

const estoreSignIn = ({ baseUrl, store_id, email, href }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_LOGIN_IN)({
    baseUrl: cloudapiUrl
  });
  const bodyParams = {
    store_id,
    email
  };
  return xhr.post(url, bodyParams);
};

const estoreGetRackSpuList = ({ baseUrl, rack_id, rack_spu_status }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  let url = '';
  if (rack_spu_status) {
    url = template(ESTORE_GET_RACK_SPU_LIST)({
      baseUrl: cloudapiUrl,
      rack_id,
      rack_spu_status
    });
  } else {
    url = template(ESTORE_GET_RACK_SPU_LIST_B)({
      baseUrl: cloudapiUrl,
      rack_id
    });
  }
  return xhr.get(url);
};

const estoreGetFulfillType = ({ baseUrl, fulfill_type }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(GET_FULFILL_TYPE)({
    baseUrl: cloudapiUrl,
    fulfill_type
  });
  return xhr.get(url);
};

const estoreSaveSetting = ({ baseUrl, rack_id, rack_name, store_id, settingArray = [] }) => {
  const cloudapiUrl = baseUrl.replace('zno', 'asovx');
  const url = template(ESTORE_SAVE_SETTING)({
    baseUrl: cloudapiUrl
  });
  const bodyParams = {
    rack_id,
    store_id,
    rack_name,
    rack_settings: settingArray
  };
  return xhr.post(url, bodyParams);
};

const estoreModifySpuStatus = ({ estoreBaseUrl, rack_spu_id, operation = 'HIDE' }) => {
  const url = template(ESTORE_MODIFY_SPU_STATUS)({
    baseUrl: estoreBaseUrl
  });
  const bodyParams = {
    operation,
    rack_spu_id
  };
  return xhr.post(url, bodyParams);
};

const estoreExistsBinded = ({ estoreBaseUrl, rack_id }) => {
  const url = template(ESTORE_EXISTS_BINDED)({
    baseUrl: estoreBaseUrl,
    rack_id
  });
  return xhr.get(url);
};

const getListCollectionInfo = ({ estoreBaseUrl }) => {
  const url = template(ESTORE_LIST_COLLECTION_INFOS)({
    baseUrl: estoreBaseUrl
  });
  return xhr.get(url);
};

const bindCollection = ({
  saasBaseUrl,
  collection_ids,
  store_id,
  store_status = true,
  rack_id
}) => {
  const url = template(ESTORE_BIND_COLLECTION)({
    baseUrl: saasBaseUrl
  });
  const bodyParams = {
    collection_ids,
    store_id,
    store_status,
    rack_id
  };
  return xhr.post(url, bodyParams);
};

export default {
  estoreAddRack,
  estoreGetList,
  estoreGetRackSpuList,
  estoreGetFulfillType,
  estoreSaveSetting,
  estoreGetOptionList,
  estoreGetUserInfo,
  estoreSignIn,
  estoreModifySpuStatus,
  estoreDelRack,
  estoreExistsBinded,
  getListCollectionInfo,
  bindCollection
};
