import Immutable, { fromJS } from 'immutable';
import { get, isEmpty } from 'lodash';
import { createSelector } from 'reselect';
import { customSettingKey } from '@src/containers/base/Labs/components/config';
import { customerSpreadsType } from '@resource/lib/constants/strings';

const rootNode = state => get(state, 'root');
const getEnv = createSelector(rootNode, data => get(data, 'system.env'));
const getUrls = createSelector(getEnv, data => data.urls);

const getUserInfo = createSelector(rootNode, data => get(data, 'system.userInfo'));
const shellNode = state => get(state, 'shell');

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
      category_code
    };
  });
  const treeData = labs.listData.map(item => {
    const { id: category_id, category_name, products, category_code } = item;
    const treeNode = {
      key: category_id,
      title: category_name,
      category_code,
      level: 1
    };
    if (products) {
      treeNode.children = products.map(childItem => {
        const { product_code, product_name, spec: reSpec = {}, description, is_system = 0 } = childItem;
        const spec = {
          'spreadsType': customerSpreadsType.spreadsOnly, //给之前没有spreadsType的赋默认值
          ...reSpec
        }
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
          description
        };
        return {
          isSystem: !!is_system,
          key: product_code,
          title: product_name,
          category_code,
          level: 2
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
    productNameList
  };
});

export default state => {
  const newState = {
    envUrls: getUrls(state),
    userInfo: getUserInfo(state),
    labs: getLabs(state)
  };
  return newState;
};
