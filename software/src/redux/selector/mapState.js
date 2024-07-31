import { fromJS } from 'immutable';
import { get, isEmpty, merge } from 'lodash';
import { createSelector } from 'reselect';

import { getSettingsLogoUrl } from '@resource/lib/saas/image';

import { getDegree } from '@resource/lib/utils/exif';

import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import { customSettingKey } from '@src/containers/base/Labs/components/config';

const emptyArr = fromJS([]);
const emptyMap = fromJS({});

const rootNode = state => get(state, 'root');
const getEnv = createSelector(rootNode, data => get(data, 'system.env'));
const getUrls = createSelector(getEnv, data => data.urls);
const shellNode = state => get(state, 'shell');

// test
const getFutureClock = createSelector(shellNode, data => get(data, 'clock.future'));
const getPastClock = createSelector(shellNode, data => get(data, 'clock.past'));
const getClock = createSelector(shellNode, data => get(data, 'clock.present'));

// labs
const getLabs = createSelector(shellNode, data => {
  const labs = get(data, 'labs');
  const allProducts = {};
  const productNameList = [];
  const categoryList = labs.categoryList.map(item => {
    const { category_id, category_name, category_code } = item;
    return {
      value: category_id,
      label: category_name,
      category_code,
    };
  });
  const treeData = labs.listData.map(item => {
    const { category_id, category_name, products } = item;
    const treeNode = {
      key: category_id,
      title: category_name,
    };
    if (products) {
      treeNode.children = products.map(childItem => {
        const { product_code, product_name, spec = {}, description } = childItem;
        const specKeys = {};
        productNameList.push(product_name);
        for (const key in spec) {
          if (spec.hasOwnProperty(key)) {
            const specKey = `spec.${key}`;
            const specValue = spec[key];
            if (specKey === customSettingKey.pages && !isEmpty(specValue)) {
              specKeys[specKey] = specValue.current || specValue.min || specValue.max;
            } else {
              specKeys[specKey] = specValue;
            }
          }
        }
        allProducts[product_code] = {
          category_id,
          product_name,
          ...specKeys,
          description,
        };
        return {
          key: product_code,
          title: product_name,
        };
      });
    }
    return treeNode;
  });
  return {
    ...labs,
    categoryList,
    treeData,
    allProducts,
    productNameList,
  };
});

// settings
const getGlobalSettings = createSelector(shellNode, getUrls, (data, urls) => {
  if (!urls || !urls.size) {
    return emptyArr;
  }
  const galleryBaseUrl = urls.get('cloudBaseUrl');
  const logoBranding = get(data, ['globalSettings', 'logoBranding']);
  const image_uid = logoBranding.getIn(['logo', 'image_uid']);
  const enc_image_uid = logoBranding.getIn(['logo', 'enc_image_uid']);
  const companyName = logoBranding.get('company_name');

  const settingsLogoUrl = image_uid
    ? getSettingsLogoUrl({
        galleryBaseUrl,
        enc_image_uid,
        thumbnail_size: thumbnailSizeTypes.SIZE_350,
      })
    : null;

  const orientation = get(data, ['globalSettings', 'logoBranding']);
  const exif = orientation.getIn(['logo', 'orientation']);
  const imgRot = getDegree(exif);

  return {
    companyName,
    settingsLogoUrl,
    image_uid,
    imgRot,
    orientation: exif,
    enc_image_uid,
  };
});

const getDesignService = createSelector(shellNode, data => {
  const designer = get(data, 'designer');
  return designer;
});

export default state => ({
  clock: getClock(state),
  labs: getLabs(state),
  designService: getDesignService(state),
  globalSettings: getGlobalSettings(state),
});
