import axios from 'axios';
import { template } from 'lodash';
import {
  ESTORE_RACK_GET_LIST,
  SAAS_GALLERY_STORE_COLLECTION_BINDED_RACK,
  SAAS_GALLERY_STORE_COLLECTION_BIND_RACK
} from '@resource/lib/constants/apiUrl';
import { wrapApiFuncs } from '@resource/pwa/utils/helper';
import mocks from './mocks';
// FIXME: 这里xhr无法catch到404 error等
// import * as xhr from 'appsCommon/utils/xhr';
// import * as xhr from '@resource/websiteCommon/utils/xhr';

// 拉取货架列表
const fetchPriceSheetList = async ({ baseUrl, storeId }) => {
  const result = await axios.get(
    template(ESTORE_RACK_GET_LIST)({
      baseUrl,
      store_id: storeId
    })
  );
  return result.data;
};

// 获取collection绑定的货架
const fetchCollectionBindPriceSheet = async ({ galleryBaseUrl, collectionId }) => {
  const result = await axios.get(
    template(SAAS_GALLERY_STORE_COLLECTION_BINDED_RACK)({
      galleryBaseUrl,
      collectionUid: collectionId
    })
  );

  return result.data;
};

// 绑定货架与collection
const bindCollectionForPriceSheet = async ({
  galleryBaseUrl,
  collectionId,
  priceSheetId,
  storeId
}) => {
  const result = await axios.get(
    template(SAAS_GALLERY_STORE_COLLECTION_BIND_RACK)({
      galleryBaseUrl,
      collectionUid: collectionId,
      rackId: priceSheetId,
      storeId
    })
  );

  return result.data;
};

const api = wrapApiFuncs({
  fetchPriceSheetList,
  fetchCollectionBindPriceSheet,
  bindCollectionForPriceSheet
});

const getCollectionBindPriceSheet = async ({ galleryBaseUrl, collectionId }) => {
  const [collectionBindPriceSheet, err] = await api.fetchCollectionBindPriceSheet({
    args: [{ galleryBaseUrl, collectionId }],
    mockData: mocks.collectionBindPriceSheet,
    defaultResData: null
  });

  if (collectionBindPriceSheet && !err) {
    return collectionBindPriceSheet;
  }
  return null;
};

const getCollectionBindPriceSheetId = async ({ galleryBaseUrl, collectionId }) => {
  const result = {
    id: null
  };
  const collectionBindPriceSheet = await getCollectionBindPriceSheet({
    galleryBaseUrl,
    collectionId
  });
  if (collectionBindPriceSheet) {
    result.id = collectionBindPriceSheet.store_rack_id;
  }
  return result;
};

// 组装货架下拉框的选项列表
const composePriceSheetSelectOptions = async ({
  baseUrl,
  galleryBaseUrl,
  storeId,
  collectionId
}) => {
  const result = {
    options: [],
    selectedOption: null,
    priceSheetList: []
  };

  const [priceSheetList, err1] = await api.fetchPriceSheetList({
    args: [{ baseUrl, storeId }],
    mockData: mocks.priceSheetList,
    defaultResData: []
  });
  if (err1) return result;
  result.priceSheetList = priceSheetList;
  result.options = priceSheetList.map(sheet => ({
    value: sheet.id,
    label: sheet.rack_name,
    spu_price_abnormal: sheet.spu_price_abnormal
  }));

  const collectionBindPriceSheet = await getCollectionBindPriceSheet({
    galleryBaseUrl,
    collectionId
  });
  if (collectionBindPriceSheet) {
    const { store_rack_id } = collectionBindPriceSheet;
    const bindOption = result.options.find(o => o.value === store_rack_id);
    result.selectedOption = bindOption || null;
  }

  console.log('storeSettingService composePriceSheetSelectOptions: ', result);

  return result;
};

// 绑定PriceSheet和collection
const bindPriceSheet = async ({ galleryBaseUrl, collectionId, priceSheetId, storeId }) => {
  const [data, err] = await api.bindCollectionForPriceSheet({
    args: [{ galleryBaseUrl, collectionId, priceSheetId, storeId }]
  });
  return err;
};

const storeSettingService = {
  composePriceSheetSelectOptions,
  bindPriceSheet,
  getCollectionBindPriceSheet,
  getCollectionBindPriceSheetId
};

export default storeSettingService;
