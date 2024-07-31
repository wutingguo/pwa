import { template } from 'lodash';

import * as xhr from '@resource/websiteCommon/utils/xhr';

import {
  PAY_SETTINGS_LIST,
  PAY_SETTINGS_UPDATE,
  PAY_WECHAT_APPLY,
  PAY_WECHAT_APPLY_FORM,
  PAY_WECHAT_AREACODELIST,
  PAY_WECHAT_ORDER_LIST,
  PAY_WECHAT_SUBMIT,
  PAY_WECHAT_UPLOADIMG,
} from '@common/constants/apiUrl';

export const areaCodeList = ({ baseUrl }) => {
  return new Promise(resolve => {
    const url = template(PAY_WECHAT_AREACODELIST)({
      baseUrl,
    });
    xhr.get(url).then(res => {
      resolve(res.data);
    });
  });
};
export const applyFormInfo = ({ baseUrl }) => {
  return new Promise(resolve => {
    const url = template(PAY_WECHAT_APPLY_FORM)({
      baseUrl,
    });
    xhr.get(url).then(res => {
      resolve(res.data);
    });
  });
};
export const applyStatus = ({ baseUrl }) => {
  return new Promise(resolve => {
    const url = template(PAY_WECHAT_APPLY)({
      baseUrl,
    });
    xhr.get(url).then(res => {
      resolve(res.data);
    });
  });
};
export const paySettingList = ({ baseUrl, customer_id }) => {
  return new Promise(resolve => {
    const url = template(PAY_SETTINGS_LIST)({
      baseUrl,
      customer_id,
    });
    xhr.get(url).then(res => {
      resolve(res.data);
    });
  });
};
export const updatePaySetting = ({ baseUrl, params }) => {
  return new Promise(resolve => {
    const url = template(PAY_SETTINGS_UPDATE)({
      baseUrl,
    });
    xhr.post(url, params).then(res => {
      resolve(res);
    });
  });
};
export const payWechatUploadImg = ({ baseUrl, params }) => {
  return new Promise(resolve => {
    const url = template(PAY_WECHAT_UPLOADIMG)({
      baseUrl,
    });
    xhr.purepost(url, params).then(res => {
      resolve(res.data);
    });
  });
};
export const payWechatSubmit = ({ baseUrl, params }) => {
  return new Promise(resolve => {
    const url = template(PAY_WECHAT_SUBMIT)({
      baseUrl,
    });
    xhr.post(url, params).then(res => {
      resolve(res);
    });
  });
};
export const payWechatOrderList = ({ baseUrl, favorite_id }) => {
  return new Promise(resolve => {
    const url = template(PAY_WECHAT_ORDER_LIST)({
      baseUrl,
      favorite_id,
    });
    xhr.get(url).then(res => {
      resolve(res.data);
    });
  });
};
