import request from 'appsCommon/utils/ajax';
import { template } from 'lodash';

import {
  GET_NORMAL_ADDRESS,
  SUBMIT_GALLERY,
  SUBMIT_GALLERY_NEW,
} from '@resource/lib/constants/apiUrl';

import * as xhr from '@resource/websiteCommon/utils/xhr';

export const submitGallery = params => {
  const { galleryBaseUrl, ...extraProps } = params;
  return new Promise(resolve => {
    const url = template(SUBMIT_GALLERY_NEW)({
      galleryBaseUrl,
    });
    xhr.post(url, extraProps).then(res => {
      resolve(res);
    });
  });
};

/**
 * 获取地址详情
 * @returns {Promise<unknown>}
 */
export const getAddressDetail = ({ address_id, estoreBaseUrl }) => {
  return new Promise((resolve, reject) => {
    const url = template(GET_NORMAL_ADDRESS, {
      addressId: address_id,
      baseUrl: estoreBaseUrl,
    });
    request({
      url: url,
      success: result => {
        const newResult = typeof result === 'string' ? JSON.parse(result) : result;
        const { ret_code, data = {} } = newResult;
        if (ret_code === 200000) {
          resolve(data);
        } else {
          reject();
        }
      },
      error: () => {
        const result = { respCode: '2000', respMsg: 'failed' };
        reject(result);
      },
    });
  });
};
