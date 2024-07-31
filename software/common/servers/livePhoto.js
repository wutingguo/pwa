import { template } from 'lodash';

import * as xhr from '@resource/websiteCommon/utils/xhr';

import { LIVE_PHOTO_VERIFY_KEY } from '@common/constants/apiUrl';

import { GET_ACTIVITY_DETAILS } from '@apps/workspace/constants/apiUrl';

export const verifyKey = ({ baseUrl, key }) => {
  return new Promise(resolve => {
    const url = template(LIVE_PHOTO_VERIFY_KEY)({
      baseUrl,
      key,
    });
    xhr.get(url).then(res => {
      resolve(res.data);
    });
  });
};

/**
 * 获取活动详情信息
 */
export const getActivityDetail = ({ baseUrl, enc_broadcast_id }) => {
  return new Promise(resolve => {
    const url = template(GET_ACTIVITY_DETAILS)({ baseUrl, enc_broadcast_id });
    xhr.get(url).then(res => {
      resolve(res.data);
    });
  });
};
