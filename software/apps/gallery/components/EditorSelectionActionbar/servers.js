import * as xhr from '@resource/websiteCommon/utils/xhr';
import { template } from 'lodash';
import { APPLY_ORIGIN_IMG } from '@resource/lib/constants/apiUrl';

// 获取所有客户的 favorite list
export const applyOriginalImg = (galleryBaseUrl, bodyParams) => {
  const url = template(APPLY_ORIGIN_IMG)({
    galleryBaseUrl
  });
  return xhr.post(url, bodyParams);
};
