import { pick } from 'lodash';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import request from '@resource/websiteCommon/utils/ajax';
import { convertObjIn } from '@resource/websiteCommon/utils/typeConverter';
import { GET_CURRENCY_PRICE } from '@resource/websiteCommon/constants/apiUrl';
import { getLanguageCode, absoluteUrl } from '@resource/lib/utils/language';
import { getCurrencyCode, getCountryCode } from '@resource/lib/utils/currency';
import {
  useNewCalculatorProducts,
  needJumpPageUrlMap,
  needDefaultParamsProductsAtJumpPage
} from '@resource/lib/constants/strings';
import { buildUrlParmas, buildUrlParmasJSON, buildOptionsDefaultJSON } from '../../../utils/url';
import { template } from '../../../utils/template';
import customeLabSrc from './img/customer.jpg';
import {
  OPEN_DESIGNER_APP_US,
  GET_CATEGORY_DETAIL,
  GET_PRODUCT_CATEGORY,
  GET_VIRTUAL_TYPE,
  CREATE_NEW_PROJECT_CATEGORY_IMAGE_URL,
  NEW_CUSTOME_FACTORY_LIST,
  NEW_CUSTOME_PRODUCT_LIST,
  NEW_CUSTOME_CATEGORY_LIST
} from '../../../constants/apiUrl';
import { productCategorysFilter, productsFilter } from '@resource/pwa/utils/strings';

import { makeParamsMap, transferMakeParams, transferAddedKeys } from '../../../constants/strings';

const packageTypeMaps = ['single', 'package', 'multiple'];

const getLabs = that => {
  const defaultFactory = {
    label: 'LAB_ZNO',
    value: 0
  };

  // that.setState({
  //   labsData,
  //   selectedLab: labsData[0],
  //   selectedProduct: {},
  //   calculatorLoading: true,
  // });

  const url = template(NEW_CUSTOME_FACTORY_LIST, {
    baseUrl: that.getWWWorigin()
  });
  const params = {
    bizLine: 'US',
    name: '',
    code: ''
  };

  xhr
    .post(url, params)
    .then(result => {
      const factoryList = result.data.map(i => ({
        label: i.name,
        value: i.id,
        id: i.id
      }));

      that.setState({
        labsData: [defaultFactory].concat(factoryList),
        selectedLab: defaultFactory,
        selectedProduct: {},
        calculatorLoading: true
      });
      that.getCategoryProduct();
    })
    .catch(error => {
      console.log(error);
      that.setState({
        labsData: [defaultFactory],
        selectedLab: defaultFactory,
        selectedProduct: {},
        calculatorLoading: true
      });
    });
};

const getCategoryProduct = that => {
  const { isCustomLab } = that.state;
  return xhr
    .get(
      template(GET_PRODUCT_CATEGORY, {
        baseUrl: that.getWWWorigin()
      })
    )
    .then(result => {
      const { success, data } = result;
      if (success) {
        const categoryProductData = data
          .filter(i => !productCategorysFilter.includes(i.code) && i.code !== 'ALL')
          .map(i => ({
            category_code: i.code,
            category_name: i.displayName,
            categoryImageUrl: i.categoryImageUrl
          }));

        const selectedCategory =
          categoryProductData && categoryProductData.length ? categoryProductData[0] : [];

        that.setState(
          {
            categoryProductData,
            selectedCategory,
            selectedProduct: {},
            calculatorLoading: false,
            imgUrl: that.getImgUrl(
              CREATE_NEW_PROJECT_CATEGORY_IMAGE_URL,
              selectedCategory.categoryImageUrl || '/Albums_Books@2x.jpg',
              isCustomLab
            )
          },
          () => {
            that.getProductsList(selectedCategory);
          }
        );
      }
    })
    .catch(error => {
      console.log(error);
    });
};
const getCustomCategoryProduct = (that, selectedLab) => {
  const labId = selectedLab.id;
  const url = template(NEW_CUSTOME_CATEGORY_LIST, {
    baseUrl: that.getWWWorigin(),
    labId: selectedLab.id
  });

  return xhr
    .get(url)
    .then(result => {
      const categoryList = result.data.map(item => {
        return Object.assign({}, item, { category_code: item.id });
      });
      const selectedCategory = categoryList.length > 0 ? categoryList[0] : {};
      that.setState(
        {
          categoryProductData: categoryList,
          selectedCategory,
          selectedProduct: {}
        },
        () => {
          that.getCustomProductsList(selectedCategory, labId);
        }
      );
    })
    .catch(error => {
      console.log(error);
    });
};
const getCustomProductsList = (that, selectedCategory, labId) => {
  const { id: categoryId } = selectedCategory;
  const url = template(NEW_CUSTOME_PRODUCT_LIST, {
    baseUrl: that.getWWWorigin(),
    labId,
    categoryId,
    customerId: '0'
  });
  xhr
    .get(url)
    .then(result => {
      const productsList = result.data ? result.data : [];
      that.setState({ productsList });
    })
    .catch(error => {
      console.log(error);
    });
};

const getProductsList = (that, { category_code }) => {
  that.setState({
    calculatorLoading: true
  });

  return xhr
    .get(
      template(GET_CATEGORY_DETAIL, {
        baseUrl: that.getWWWorigin(),
        category: category_code,
        autoRandomNum: Date.now()
      })
    )
    .then(result => {
      const data = result[0].list || [];
      const productsList = data
        .filter(i => !productsFilter.includes(i.productCode))
        .map(i => ({
          ...i,
          product_code: i.productCode
        }));

      that.setState({
        productsList,
        calculatorLoading: false
      });
    })
    .catch(error => {
      console.log(error);
    });
};

const getVisualType = (that, sku_code, callback) => {
  return xhr
    .get(template(GET_VIRTUAL_TYPE, { baseUrl: that.getWWWorigin(), sku_code }))
    .then(result => {
      const { ret_code, data } = result;
      if (ret_code == 200000) {
        const packageType = packageTypeMaps[data];
        callback && callback(packageType);
      }
    })
    .catch(error => {
      console.log(error);
    });
};

const getCurrentSkuCode = that => {
  const { calculatorData } = that.state;

  if (!calculatorData) {
    return false;
  }

  const { selectionList: root } = calculatorData;

  const { selectedState: selections } = that.state;

  let selectedBranch = root;
  let selectedNode;
  while (selectedBranch && selectedBranch.length > 0) {
    selectedNode =
      selectedBranch.find((node, index) => {
        const { optionKey: key } = node;

        const selection = selections.find(s => s.key === key);
        if (!selection) {
          return false;
        }

        return index === selection.index;
      }) || selectedBranch[0];
    selectedBranch = selectedNode.childNodes;
  }

  return selectedNode && selectedNode.skuCode;
};

const initCalculatorData = (that, callback) => {
  const selectedState = [];
  const { calculatorData } = that.state;
  if (calculatorData && calculatorData.selectionList && calculatorData.selectionList.length) {
    const selectionNames = calculatorData.selectionNames;
    selectionNames.forEach((key, index) => {
      selectedState.push({
        key,
        index: 0
      });
    });
  }

  that.setState(
    {
      selectedState
    },
    () => {
      callback && callback();
    }
  );
};

const buildMakeParams = that => {
  const { calculatorData, selectedCategory, selectedProduct } = that.state;
  const { selectionNames } = calculatorData;
  const category = selectedCategory.category_code;
  const product = selectedProduct && selectedProduct.product_code;
  const productArr = product.split('/');
  const makeParams = {
    category,
    product: productArr[productArr.length - 1]
  };
  const selectedValues = that.getSelectedValues();

  transferMakeParams.forEach(p => {
    const paramsMap = makeParamsMap[p] || [];
    const index = selectionNames.findIndex((n, idx) => {
      const hasMapKey = paramsMap.some(item => item === n);
      if (hasMapKey) {
        return true;
      }
      if (p === 'size') {
        return /\d+x\d+/i.test(selectedValues[idx]);
      } else if (p === 'flyInterColor') {
        return n.toLowerCase().indexOf(p.toLowerCase()) >= 0 && p === 'flyInterColor';
      } else if (p === 'boxinsidepanel') {
        return n.toLowerCase().indexOf(p.toLowerCase()) >= 0 && p === 'boxinsidepanel';
      }
      return n.toLowerCase().indexOf(p.toLowerCase()) >= 0;
    });
    if (index != -1) {
      makeParams[p] = selectedValues[index];
    }
  });

  makeParams.skuCode = that.getCurrentSkuCode();

  return makeParams;
};

const getSelectedValues = that => {
  const { selectedState } = that.state;
  const { calculatorData } = that.state;
  const { selectionList, selectionNames } = calculatorData;
  let currentItem = null;
  let item = selectionList;
  const result = [];
  selectionNames.forEach(key => {
    const state =
      selectedState.find(m => {
        return m.key === key;
      }) || {};
    const { index } = state;
    const tItem = item[index] || item[0];
    if (tItem) {
      currentItem = tItem;
      result.push(currentItem.value);
      item = currentItem.childNodes;
    }
  });
  return result;
};

const getCurrentItem = that => {
  const { selectedState } = that.state;
  const { calculatorData } = that.state;
  const { selectionList, selectionNames } = calculatorData;
  let currentItem = null;
  let item = selectionList;
  selectionNames.forEach(key => {
    const state =
      selectedState.find(m => {
        return m.key === key;
      }) || {};
    const { index } = state;
    const tItem = item[index] || item[0];
    if (tItem) {
      currentItem = tItem;
      item = currentItem.childNodes;
    }
  });
  return currentItem;
};

const getCurrencyPrice = (that, pageAdded) => {
  const url = template(GET_CURRENCY_PRICE, {
    baseUrl: that.getWWWorigin(),
    skuCode: that.getCurrentSkuCode(),
    currencyCode: getCurrencyCode(),
    countryCode: getCountryCode(),
    languageCode: getLanguageCode(),
    pageAdded
  });

  return new Promise((resolve, reject) => {
    request({
      url,
      success: res => {
        try {
          const result = JSON.parse(res);
          const { data } = convertObjIn(result);
          resolve(data);
        } catch (e) {
          console.error('currency/getPrice.ep failed');
          reject();
        }
      },
      error: reject
    });
  });
};

const updatePriceInState = (that, data) => {
  that.setState({
    currentPrice: data
  });
};

const handleMakeClick = (that, e) => {
  const event = e || window.event;
  const { selectedProduct, isCustomLab, customParams } = that.state;

  that.setState({
    startButtonClicked: true
  });

  if (!selectedProduct || !selectedProduct.product_code) {
    return;
  }

  const isNeedJump = that.getIsNeedJumpProduct();

  if (isNeedJump) {
    let jumpUrl =
      that.getWWWorigin() + needJumpPageUrlMap[selectedProduct.product_code].substring(1);
    const addParamsUrl = buildOptionsDefaultJSON(
      that.props.currentOptions,
      that.props.selectionList
    );
    if (needDefaultParamsProductsAtJumpPage.includes(selectedProduct.product_code)) {
      if (jumpUrl.indexOf('?') !== -1) {
        jumpUrl = jumpUrl + `&${addParamsUrl}`;
      } else {
        jumpUrl = jumpUrl + `?${addParamsUrl}`;
      }
    }
    window.location = jumpUrl;

    return false;
  }
  let skuCode = '';
  if (!isCustomLab) {
    skuCode = that.getIsNewCalculatorProduct() ? that.props.skuCode : that.getCurrentSkuCode();
  }

  let title = that.state.title;
  if (!title) {
    title = t('DEFAULT_TITLE');
  }

  skuCode = that.getIsNewCalculatorProduct() ? that.props.skuCode : that.getCurrentSkuCode();
  const languageCode = getLanguageCode();

  let addParamsUrl = '',
    addedParams = {};
  if (that.getIsNewCalculatorProduct()) {
    addParamsUrl = buildUrlParmasJSON(that.props.currentOptions, that.props.selectionList);
  } else if (isCustomLab) {
    const { countPages, ...res } = customParams;
    addParamsUrl = buildUrlParmas(
      {
        product_code: selectedProduct.product_code,
        countPages: countPages * 2,
        ...res
      },
      false
    );
  } else {
    const makeParams = that.buildMakeParams() || {};
    addedParams = pick(makeParams, transferAddedKeys) || [];
    addParamsUrl = buildUrlParmas(addedParams, false);
  }

  window.logEvent.addPageEvent({
    name: 'CreatNewProject_Click_Start',
    lab_type: 'Supplier_type',
    projectName: title,
    ...(that.getIsNewCalculatorProduct() ? that.props.currentOptions : addedParams)
  });
  // 测试环境暂时先处理一下
  // if(window.location.host.includes('asovx.com')){
  //   addParamsUrl = addParamsUrl + '&estoreSource=1'

  // }

  if (skuCode) {
    that.getVisualType(skuCode, packageType => {
      const url =
        template(OPEN_DESIGNER_APP_US, { packageType, languageCode, title, skuCode }) +
        addParamsUrl;

      window.location.href = url;
    });
  }
  if (isCustomLab) {
    const url =
      template(OPEN_DESIGNER_APP_US, { packageType: 'single', languageCode, title }) + addParamsUrl;
    window.location.href = url;
  }

  event.preventDefault();
  return false;
};

const getIsNewCalculatorProduct = that => {
  const { selectedProduct, selectedCategory } = that.state;
  // return selectedCategory.category_code === 'PB' || useNewCalculatorProducts.includes(selectedProduct.product_code);
  return (
    selectedProduct.product_code && useNewCalculatorProducts.includes(selectedProduct.product_code)
  );
};

const getIsNeedJumpProduct = that => {
  const { selectedProduct } = that.state;
  return (
    selectedProduct.product_code &&
    Object.keys(needJumpPageUrlMap).includes(selectedProduct.product_code)
  );
};

const getWWWorigin = that => {
  const { envUrls } = that.props;
  return envUrls.get('baseUrl');
};

const getImgUrl = (that, url, imagePath, isCustomLab) => {
  if (isCustomLab) {
    return customeLabSrc;
  }
  return template(url, {
    imagePath,
    baseUrl: that.getWWWorigin()
  });
};

export {
  getWWWorigin,
  getImgUrl,
  getLabs,
  getCategoryProduct,
  getCustomCategoryProduct,
  getCustomProductsList,
  getProductsList,
  getVisualType,
  getCurrentSkuCode,
  initCalculatorData,
  buildMakeParams,
  getSelectedValues,
  getCurrentItem,
  getCurrencyPrice,
  updatePriceInState,
  handleMakeClick,
  getIsNewCalculatorProduct,
  getIsNeedJumpProduct
};
