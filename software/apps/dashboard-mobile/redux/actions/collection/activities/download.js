import {
  SAAS_GET_PACKAGE_DOWNLOAD_RECORD_LIST,
  SAAS_GET_SINGLE_DOWNLOAD_RECORD_LIST,
} from '@resource/lib/constants/apiUrl';

import request from '@apps/gallery/utils/request';

// 复制到新的选的选片集
export function getPackageDownloadRecords(collectionId) {
  return request({
    url: SAAS_GET_PACKAGE_DOWNLOAD_RECORD_LIST,
    method: 'POST',
    isConvert: false,
    bodyParams: {
      collection_id: collectionId,
    },
  });
}

// 复制到新的选的选片集
export function getSingleDownloadRecords(collectionId) {
  return request({
    url: SAAS_GET_SINGLE_DOWNLOAD_RECORD_LIST,
    method: 'POST',
    isConvert: false,
    bodyParams: {
      collection_id: collectionId,
    },
  });
}
