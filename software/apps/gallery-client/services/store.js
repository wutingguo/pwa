import collectionPriceSheetService from '@apps/gallery/containers/international/Collections/Detail/Settings/Store/service';
import { template } from 'lodash';
import {
  ESTORE_GET_STORE_BY_ID,
  SAAS_CLIENT_GALLERY_PRINT_STORE_USER_INFO
} from '@resource/lib/constants/apiUrl';
import * as xhr from 'appsCommon/utils/xhr';

export const getStoreUser = async ({ estoreBaseUrl }) => {
  return new Promise((resolve, reject) => {
    const url = template(SAAS_CLIENT_GALLERY_PRINT_STORE_USER_INFO)({
      galleryBaseUrl: estoreBaseUrl
    });
    xhr.get(url).then(res => {
      resolve(res);
    });
  });
};

export const getStoreId = async ({ estoreBaseUrl, collectionUid }) => {
  const collectionBindPriceSheet = await collectionPriceSheetService.getCollectionBindPriceSheet({
    galleryBaseUrl: estoreBaseUrl,
    collectionId: collectionUid
  });
  // 通过collectionUid拿到的rack
  console.log('collectionBindPriceSheet', collectionBindPriceSheet);
  const { store_id, store_rack_id, collection_id } = collectionBindPriceSheet || {};
  return store_id;
};

export const getStoreById = ({ baseUrl, storeId }) => {
  return new Promise((resolve, reject) => {
    const url = template(ESTORE_GET_STORE_BY_ID)({ baseUrl, store_id: storeId });
    xhr.get(url).then(result => {
      const { ret_code, data = {} } = result;
      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject;
      }
    });
  });
};
