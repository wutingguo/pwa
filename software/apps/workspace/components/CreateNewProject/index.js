import classNames from 'classnames';
import { pick } from 'lodash';
import React, { Component, Fragment } from 'react';

import CalculatorControl from '@resource/components/CalculatorControl';

import { getCountryCode, getCurrencyCode } from '@resource/lib/utils/currency';
import { absoluteUrl, getLanguageCode } from '@resource/lib/utils/language';

import {
  CUSTOME_FACTORY_LIST,
  CUSTOME_PRODUCT_LIST,
  GET_CATEGORY_DETAIL,
  GET_CN_PRODUCT_CATEGORY_V3,
  PRODUCT_BANNER_IMAGE_PC,
} from '@resource/lib/constants/apiUrl';
import { showAliasNameProductArray } from '@resource/lib/constants/strings';

import { productCategorysFilterCN } from '@resource/pwa/utils/strings';

import XSelect from '@resource/websiteCommon/components/dom/XSelect';
import { GET_CURRENCY_PRICE } from '@resource/websiteCommon/constants/apiUrl';
import request from '@resource/websiteCommon/utils/ajax';
import { convertObjIn } from '@resource/websiteCommon/utils/typeConverter';
import * as xhr from '@resource/websiteCommon/utils/xhr';

import {
  CREATE_NEW_PROJECT_IMAGE_URL,
  GET_VIRTUAL_TYPE,
  NEW_CUSTOME_CATEGORY_LIST,
  NEW_CUSTOME_FACTORY_LIST,
  NEW_CUSTOME_PRODUCT_LIST,
  OPEN_DESIGNER_APP,
} from '../../constants/apiUrl';
import {
  customUnitLabelMap,
  makeParamsMap,
  transferAddedKeys,
  transferMakeParams,
} from '../../constants/strings';
import { fetchCalculateInfo, formatWeddingBookCalculateInfo } from '../../utils/calculator';
import { template } from '../../utils/template';
import { buildUrlParmas, buildUrlParmasJSON } from '../../utils/url';

import check_blank from './img/check_blank.png';
import check_green from './img/check_green.png';
import check_red from './img/check_red.png';
import customeLabSrc from './img/customer-lab.jpg';

import './index.scss';

//逐步兼容新计算器
const useNewCalProduct = [];
const noUseNewCalProduct = [
  'V2_MASTERSET',
  'OT_FOIL_COPPER',
  'CB_SOLIDWOODCOMBINATION',
  'CB_METALCOMBINATION',
];
const useNewCalCategory = ['PB', 'WA', 'TABLE', 'PP', 'CS', 'DTR'];

class CreateNewProduct extends Component {
  constructor(props) {
    super(props);

    const data = props.pathContext || {};

    const { getInstance } = props;
    if (typeof getInstance === 'function') {
      getInstance(this);
    }

    this.state = {
      data,
      categoryProductData: [],
      productsList: [],
      labsData: [],
      selectedLab: {},
      selectedCategory: {},
      selectedProduct: {},
      selectedState: [],
      optionTip: '',
      startButtonClicked: false,
      title: '未命名',
      isCustomLab: false,
      customParams: {},
    };

    this.initCalculatorData = this.initCalculatorData.bind(this);
    this.getCategoryProduct = this.getCategoryProduct.bind(this);
    this.getVisualType = this.getVisualType.bind(this);
    this.getSelectedValues = this.getSelectedValues.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.onClearSelectedProduct = this.onClearSelectedProduct.bind(this);
    this.onProductChange = this.onProductChange.bind(this);
    this.getCurrentSkuCode = this.getCurrentSkuCode.bind(this);
    this.getRenderTitle = this.getRenderTitle.bind(this);
    this.onTitleFocus = this.onTitleFocus.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.getCurrencyPrice = this.getCurrencyPrice.bind(this);
    this.updatePriceInState = this.updatePriceInState.bind(this);
    this.buildMakeParams = this.buildMakeParams.bind(this);
    this.handleMakeClick = this.handleMakeClick.bind(this);
    this.getCurrentItem = this.getCurrentItem.bind(this);
    this.getRenderOptionSelect = this.getRenderOptionSelect.bind(this);
    this.getRenderCategorySelect = this.getRenderCategorySelect.bind(this);
    this.getRenderProductSelect = this.getRenderProductSelect.bind(this);
    this.getRenderOptions = this.getRenderOptions.bind(this);
    this.onOptionChange = this.onOptionChange.bind(this);
    this.getAdditionalInfo = this.getAdditionalInfo.bind(this);
    this.getIsNewCalculatorProduct = this.getIsNewCalculatorProduct.bind(this);
    this.getLabs = this.getLabs.bind(this);
    this.onLabChange = this.onLabChange.bind(this);
    this.getRenderLabSelect = this.getRenderLabSelect.bind(this);
    this.onClearSelectedCategory = this.onClearSelectedCategory.bind(this);
    this.getRenderLabCategoryProduct = this.getRenderLabCategoryProduct.bind(this);
    this.getWWWorigin = this.getWWWorigin.bind(this);
    this.getProductsList = this.getProductsList.bind(this);
  }

  componentDidMount() {
    this.getLabs();
  }

  getWWWorigin(key) {
    const { envUrls } = this.props;
    if (key) {
      return envUrls.get(key);
    }
    return envUrls.get('baseUrl');
  }

  getLabs() {
    const defaultFactory = {
      label: 'LAB_ZNO',
      value: 0,
    };

    const url = template(NEW_CUSTOME_FACTORY_LIST, {
      baseUrl: this.getWWWorigin('galleryBaseUrl'),
    });
    const params = {
      bizLine: 'YX',
    };

    xhr
      .post(url, params)
      .then(result => {
        const factoryList = result.data.map(i => ({
          label: i.name,
          value: i.id,
          id: i.id,
        }));

        this.setState({
          labsData: [defaultFactory].concat(factoryList),
          selectedLab: defaultFactory,
        });
        this.getCategoryProduct();
      })
      .catch(error => {
        console.log(error);
        this.setState({
          labsData: [defaultFactory],
          selectedLab: defaultFactory,
        });
      });
  }

  getCategoryProduct() {
    return xhr
      .get(
        template(GET_CN_PRODUCT_CATEGORY_V3, {
          baseUrl: this.getWWWorigin(),
        })
      )
      .then(result => {
        const { success, data } = result;
        if (success) {
          const categoryProductData = data
            .filter(i => !productCategorysFilterCN.includes(i.code))
            .map(i => ({
              category_code: i.code,
              category_name: i.displayName,
            }));

          let selectedCategory;
          if (categoryProductData && categoryProductData.length) {
            selectedCategory = categoryProductData[0];
          }

          this.setState(
            {
              categoryProductData,
              selectedCategory,
              selectedProduct: {},
            },
            () => {
              this.getProductsList(selectedCategory);
            }
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  getCustomCategoryProduct = selectedLab => {
    const url = template(NEW_CUSTOME_CATEGORY_LIST, {
      baseUrl: this.getWWWorigin('galleryBaseUrl'),
      labId: selectedLab.id,
    });

    return xhr
      .get(url)
      .then(result => {
        const categoryList = result.data.map(item => {
          return Object.assign({}, item, { category_code: item.id });
        });
        const selectedCategory = categoryList.length > 0 ? categoryList[0] : {};
        this.setState(
          {
            categoryProductData: categoryList,
            selectedCategory,
            selectedProduct: {},
          },
          () => {
            this.getCustomProductsList(selectedCategory, selectedLab.id);
          }
        );
      })
      .catch(error => {
        console.log(error);
      });
  };

  getProductsList({ category_code }) {
    return xhr
      .get(
        template(GET_CATEGORY_DETAIL, {
          baseUrl: this.getWWWorigin(),
          category: category_code,
          autoRandomNum: Date.now(),
          isSelection: 'false',
        })
      )
      .then(result => {
        const productsList = result[0].list.map(i => ({
          ...i,
          product_code: i.productCode,
        }));
        this.setState({ productsList });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getCustomProductsList = (selectedCategory, labId) => {
    const { id: categoryId } = selectedCategory;
    const url = template(NEW_CUSTOME_PRODUCT_LIST, {
      baseUrl: this.getWWWorigin('galleryBaseUrl'),
      labId,
      categoryId,
      customerId: '0',
    });
    xhr
      .get(url)
      .then(result => {
        const productsList = result.data ? result.data : [];
        this.setState({ productsList });
      })
      .catch(error => {
        console.log(error);
      });
  };

  getVisualType(sku_code, callback) {
    return xhr
      .get(template(GET_VIRTUAL_TYPE, { baseUrl: this.getWWWorigin(), sku_code }))
      .then(result => {
        const { ret_code, data } = result;
        if (ret_code == 200000) {
          const packageType = data === 0 ? 'single' : data === 1 ? 'package' : 'multiple';
          callback && callback(packageType);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  initCalculatorData(callback) {
    const selectedState = [];
    const { calculatorData } = this.state;
    if (calculatorData && calculatorData.selectionList && calculatorData.selectionList.length) {
      const selectionNames = calculatorData.selectionNames;
      selectionNames.forEach((key, index) => {
        selectedState.push({
          key,
          index: 0,
        });
      });
    }

    this.setState(
      {
        selectedState,
      },
      () => {
        callback && callback();
      }
    );
  }

  buildMakeParams() {
    const { calculatorData, selectedCategory, selectedProduct } = this.state;
    const { selectionNames } = calculatorData;
    const category = selectedCategory.category_code;
    const product = selectedProduct && selectedProduct.product_code;
    const productArr = product.split('/');
    const makeParams = {
      category,
      product: productArr[productArr.length - 1],
    };
    const selectedValues = this.getSelectedValues();

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

    makeParams.skuCode = this.getCurrentSkuCode();

    return makeParams;
  }

  getCurrentSkuCode() {
    const { calculatorData } = this.state;

    if (!calculatorData) {
      return false;
    }

    const { selectionList: root } = calculatorData;

    const { selectedState: selections } = this.state;

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
  }

  getSelectedValues() {
    const { selectedState } = this.state;
    const { calculatorData } = this.state;
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
  }

  getCurrentItem() {
    const { selectedState } = this.state;
    const { calculatorData } = this.state;
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
  }

  getCurrencyPrice(pageAdded) {
    const url = template(GET_CURRENCY_PRICE, {
      baseUrl: this.getWWWorigin(),
      skuCode: this.getCurrentSkuCode(),
      currencyCode: getCurrencyCode(),
      countryCode: getCountryCode(),
      languageCode: getLanguageCode(),
      pageAdded,
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
        error: reject,
      });
    });
  }

  updatePriceInState(data) {
    this.setState({
      currentPrice: data,
    });
  }

  onTitleFocus() {}

  onTitleChange(event) {
    const { value } = event.target;
    this.setState({
      title: value,
      titleTip: '',
      commonErrorTip: '',
    });
  }

  onLabChange(selected) {
    if (selected.value === this.state.selectedLab.value) {
      return false;
    }
    // if (!this.props.checkLevel()) {
    //   this.props.showUpdateModal();
    //   return false;
    // }

    const selectedLab = this.state.labsData.find(item => {
      return item.value === selected.value;
    });

    const isCustomLab = selectedLab.value !== 0;
    if (selectedLab) {
      this.setState(
        {
          selectedLab,
          isCustomLab,
          selectedProduct: {},
        },
        () => {
          this.onClearSelectedCategory();
          if (isCustomLab) {
            this.getCustomCategoryProduct(selectedLab);
          } else {
            this.getCategoryProduct(selectedLab);
          }
        }
      );
    }
  }

  onCategoryChange(list, selected) {
    const { isCustomLab, selectedLab } = this.state;
    const { id: labId } = selectedLab;
    const selectedCategory = list.find(item => {
      return item.category_code === selected.value;
    });
    if (selectedCategory) {
      this.setState(
        {
          selectedCategory,
        },
        () => {
          this.onClearSelectedProduct();
          if (isCustomLab) {
            this.getCustomProductsList(selectedCategory, labId);
            return;
          }
          this.getProductsList(selectedCategory);
        }
      );
    }
  }

  onClearSelectedCategory() {
    this.setState({
      selectedCategory: {},
      selectedProduct: {},
      calculatorData: null,
      currentPrice: null,
    });
  }

  onClearSelectedProduct() {
    this.setState({
      selectedProduct: {},
      calculatorData: null,
      currentPrice: null,
    });
  }

  onProductChange(list, selected) {
    const { isCustomLab } = this.state;
    const selectedProduct = list.find(item => {
      return item.product_code === selected.value;
    });
    const baseUrl = this.getWWWorigin();

    let customParams = {};
    if (isCustomLab) {
      customParams.countPages = selectedProduct.spec.sheetNumberRange.current;
    }

    this.setState(
      {
        selectedProduct,
        customParams,
      },
      () => {
        //新的
        if (this.getIsNewCalculatorProduct()) {
          this.props.updateOptionsData(selectedProduct.product_code, []);
          return false;
        }

        if (!isCustomLab) {
          // 获取该产品的价格计算器数据
          fetchCalculateInfo({
            product: selectedProduct.product_code,
            baseUrl,
          }).then(rawData => {
            const calculatorData = formatWeddingBookCalculateInfo(rawData);
            this.setState(
              {
                calculatorData,
              },
              () => {
                this.initCalculatorData(() => {
                  this.getCurrencyPrice(0).then(rawData => {
                    this.updatePriceInState(rawData);
                  });
                  const currentItem = this.getCurrentItem();
                  const { optionTip } = currentItem;
                  this.setState({
                    optionTip,
                  });
                });
              }
            );
          });
        }
      }
    );
  }

  onOptionChange(list, key, selected) {
    const selectedIndex = list.findIndex(item => {
      return item.value === selected.value;
    });

    const { selectedState, isCustomLab } = this.state;
    const makeParams = this.buildMakeParams();
    const { product } = makeParams;

    logEvent.addPageEvent({
      name: 'US_PC_ProductPage_Click_SelectOptionValue',
      product,
      key,
      value: selectedIndex,
    });

    const newState = selectedState.map((m, index) => {
      if (m.key === key) {
        return Object.assign({}, m, {
          index: selectedIndex,
        });
      }

      return m;
    });

    this.setState(
      {
        selectedState: newState,
      },
      () => {
        if (!isCustomLab) {
          this.getCurrencyPrice(0).then(rawData => {
            this.updatePriceInState(rawData);
          });
          const currentItem = this.getCurrentItem();

          const { optionTip } = currentItem;
          this.setState({
            optionTip,
          });
        }
      }
    );
  }

  handleMakeClick(e) {
    const event = e || window.event;
    const { selectedProduct, isCustomLab, customParams } = this.state;

    this.setState({
      startButtonClicked: true,
    });

    if (!selectedProduct || !selectedProduct.product_code) {
      return;
    }

    let title = this.state.title;
    if (!title) {
      title = t('DEFAULT_TITLE');
    }

    let skuCode = '';
    if (!isCustomLab) {
      skuCode = this.getIsNewCalculatorProduct() ? this.props.skuCode : this.getCurrentSkuCode();
    }

    const languageCode = getLanguageCode();

    let addParamsUrl = '',
      addedParams = {};

    if (this.getIsNewCalculatorProduct()) {
      addParamsUrl = buildUrlParmasJSON(this.props.currentOptions, this.props.selectionList);
    } else if (isCustomLab) {
      const { countPages, ...res } = customParams;
      addParamsUrl = buildUrlParmas(
        {
          product_code: selectedProduct.product_code,
          countPages: countPages * 2,
          ...res,
        },
        false
      );
    } else {
      const makeParams = this.buildMakeParams() || {};
      addedParams = pick(makeParams, transferAddedKeys) || [];
      addParamsUrl = buildUrlParmas(addedParams, false);
    }

    window.logEvent.addPageEvent({
      name: 'DesignerCreatNewProject_Click_Start',
      lab_type: 'Supplier_type',
      projectName: title,
      ...(this.getIsNewCalculatorProduct() ? this.props.currentOptions : addedParams),
    });

    if (skuCode) {
      this.getVisualType(skuCode, packageType => {
        const url =
          template(OPEN_DESIGNER_APP, { packageType, languageCode, title, skuCode }) + addParamsUrl;
        window.location.href = url;
      });
    }

    if (isCustomLab) {
      const url =
        template(OPEN_DESIGNER_APP, { packageType: 'single', languageCode, title }) + addParamsUrl;
      window.location.href = url;
    }

    event.preventDefault();
    return false;
  }

  getRenderLabSelect(list, selectedLab) {
    let labList = list.map(m => {
      return {
        value: m.value,
        label: t(m.label),
      };
    });
    return (
      <div className="select-container">
        <div className="select-name">{t('LAB_TITLE')}</div>
        <XSelect
          id="select-labs"
          searchable={false}
          clearable={false}
          options={labList}
          value={selectedLab.value}
          onChanged={value => this.onLabChange(value)}
          placeholder=""
          onLabChange
        />
        {selectedLab.label && <img className="input-check-icon" src={check_green} />}
      </div>
    );
  }

  getRenderCategorySelect(list, selectedCategory) {
    const categoryList = list.map(m => {
      return {
        value: m.category_code,
        label: m.category_name,
      };
    });

    return (
      <div className="select-container">
        <div className="select-name">产品分类</div>

        <XSelect
          id="select-category"
          searchable={false}
          clearable={false}
          options={categoryList}
          value={selectedCategory.category_code}
          onChanged={value => this.onCategoryChange(list, value)}
          placeholder=""
        />

        {selectedCategory.category_code && <img className="input-check-icon" src={check_green} />}
      </div>
    );
  }

  getRenderProductSelect(list, selectedProduct) {
    const { startButtonClicked } = this.state;

    let productList = list.map(m => {
      return {
        value: m.product_code,
        label: m.displayName || m.product_name,
      };
    });

    const selectedValue = selectedProduct ? selectedProduct.product_code : '';

    return (
      <div className="select-container">
        <div className="select-name">产品名称</div>

        <XSelect
          id="select-product"
          searchable={false}
          clearable={false}
          options={productList}
          value={selectedValue}
          onChanged={value => this.onProductChange(list, value)}
          placeholder={t('SELECT_PRODUCT')}
        />

        <img
          className="input-check-icon"
          src={startButtonClicked ? (selectedValue ? check_green : check_red) : check_blank}
        />
      </div>
    );
  }

  getRenderOptionSelect(list, selectedIndex) {
    const { calculatorData } = this.state;
    const { selectionNames, selectionDisplayNames } = calculatorData;
    const key = list[0].optionKey;
    const index = selectionNames.findIndex(name => name === key);

    let displayName = selectionDisplayNames[index];

    const optionsList = list.map(m => {
      return {
        value: m.value,
        label: m.displayName,
      };
    });

    let selectedValue;
    if (selectedIndex >= 0) {
      const index = selectedIndex < list.length ? selectedIndex : 0;
      selectedValue = list[index].value;
    }

    const isEmptyItem = !!list.find(v => !v.displayName);
    const optionClassName = classNames('select-container', {
      none: isEmptyItem,
    });

    return (
      <div className={optionClassName}>
        <div className="select-name">{displayName}</div>

        <XSelect
          id={`select-options-${key}`}
          searchable={false}
          clearable={false}
          options={optionsList}
          value={selectedValue}
          onChanged={value => this.onOptionChange(list, key, value)}
          placeholder=""
        />
      </div>
    );
  }

  getRenderTitle() {
    return (
      <div className="title-container">
        <div className="title-name">{t('LAB_PRODUCT_TITLE')}</div>
        <input
          className="title-field"
          value={this.state.title}
          onFocus={this.onTitleFocus.bind(this)}
          onChange={this.onTitleChange.bind(this)}
        />
      </div>
    );
  }

  getAdditionalInfo() {
    const { selectedProduct } = this.state;
    if (!selectedProduct || !selectedProduct.tips) {
      return null;
    }

    const tips = selectedProduct.tips;

    return (
      <div className="tips-container">
        <div className="tip">{tips.extra}</div>
        <a className="tip" href={absoluteUrl('SUPPORT_SHIPPING_COST')}>
          {tips.shipping}
        </a>
        <div className="tip">{tips.currency}</div>
      </div>
    );
  }

  getRenderLabCategoryProduct(categoryList, productsList) {
    const { labsData, selectedLab, selectedCategory, selectedProduct } = this.state;
    const html = [];
    html.push(this.getRenderLabSelect(labsData, selectedLab));
    if (categoryList && categoryList.length) {
      html.push(this.getRenderCategorySelect(categoryList, selectedCategory));
    }

    if (productsList && productsList.length) {
      html.push(this.getRenderProductSelect(productsList, selectedProduct));
    }
    return html;
  }

  getRenderOptions() {
    const html = [];
    const { selectedState } = this.state;
    const { calculatorData } = this.state;
    const { selectionList } = calculatorData;
    const key = selectionList[0].optionKey;
    const currentState =
      selectedState.find(s => {
        return s.key === key;
      }) || {};
    const { index = 0 } = currentState;
    html.push(this.getRenderOptionSelect(selectionList, index));
    let currentList = selectionList[index];
    while (currentList.childNodes && currentList.childNodes.length) {
      const childList = currentList.childNodes;
      const key = childList[0].optionKey;
      const currentState =
        selectedState.find(s => {
          return s.key === key;
        }) || {};
      const { index = 0 } = currentState;
      html.push(this.getRenderOptionSelect(currentList.childNodes, index));
      currentList = childList[index] || childList[0];
    }
    return html;
  }

  getNewRenderSelect() {
    const {
      selectedProduct: { productCode },
    } = this.state;
    const isShowAliasCode = showAliasNameProductArray.includes(productCode);

    const { currentOptions, selectionList } = this.props;
    const filterSelectList = selectionList.filter(
      item => item.options.length > 0 && !item.options[0].value_id.startsWith('none')
    );
    return filterSelectList.map(key => {
      const { productOrder, option_name, option_key } = key;
      const isCs = isShowAliasCode && option_key === 'size';
      const displayName = isCs ? '套系规格' : option_name;
      const selectedOrder = currentOptions[`order_${productOrder}`];
      const selectedValue = selectedOrder[option_key];

      const optionsList = key.options.map((m, i) => {
        return {
          value: m.value_id,
          label: isCs ? `套系${i + 1}` : m.value_name,
        };
      });

      // 过滤none值
      if (
        key.options.length === 1 &&
        key.options &&
        (key.options[0].value_id.startsWith('none') || key.options[0].value_id.startsWith('NULL'))
      ) {
        return false;
      }

      return (
        <div className="select-container">
          <div className="select-name">{`${displayName} : `}</div>
          <XSelect
            id={`select-options-${productOrder}-${option_key}`}
            searchable={false}
            clearable={false}
            options={optionsList}
            value={selectedValue}
            onChanged={value => this.handleNewSelectChange(key, value)}
            placeholder=""
          />
        </div>
      );
    });
  }

  getRenderCustomOptions = () => {
    const {
      selectedProduct: {
        spec: { sheetNumberRange, bleed, dpi, width, height, unit, spreadsType = '全跨页' },
      },
      customParams,
    } = this.state;

    const unitLabel = customUnitLabelMap[unit];

    let pageOptions = [];
    for (let i = sheetNumberRange.min; i <= sheetNumberRange.max; i++) {
      pageOptions.push({
        value: i,
        label: `${i}P(${i * 2}页)`,
      });
    }

    return (
      <Fragment>
        <div className="title-container">
          <div className="title-name">内页(跨页)尺寸</div>
          <input
            className="title-field disabled"
            value={`高${height}${unitLabel} × 宽${width}${unitLabel}`}
            disabled={true}
          />
        </div>
        <div className="title-container">
          <div className="title-name">相册类型</div>
          <input className="title-field disabled" value={spreadsType} disabled={true} />
        </div>
        <div className="title-container">
          <div className="title-name">出血线({unitLabel})</div>
          <input className="title-field disabled" value={bleed} disabled={true} />
        </div>
        <div className="title-container">
          <div className="title-name">DPI</div>
          <input className="title-field disabled" value={dpi} disabled={true} />
        </div>
        <div className="select-container">
          <div className="select-name">页数</div>
          <XSelect
            id={`select-options-custom-pages`}
            searchable={false}
            clearable={false}
            options={pageOptions}
            value={customParams.countPages}
            onChanged={value => this.handleCustomParamsChange('countPages', value)}
            placeholder=""
          />
        </div>
      </Fragment>
    );
  };

  handleCustomParamsChange = (key, select) => {
    this.setState({
      customParams: {
        ...this.state.customParams,
        [key]: select.value,
      },
    });
  };

  handleNewSelectChange(key, { value, label }) {
    const newOptions = {
      [key.option_key]: value,
    };
    this.props.setCurrentOptions(key, newOptions);
  }

  getIsNewCalculatorProduct() {
    const { selectedProduct, selectedCategory } = this.state;
    //单独不兼容的产品
    if (noUseNewCalProduct.includes(selectedProduct.product_code)) {
      return false;
    }
    //单独兼容的产品
    if (useNewCalProduct.includes(selectedProduct.product_code)) {
      return true;
    }
    //兼容的产品类型
    if (useNewCalCategory.includes(selectedCategory.category_code)) {
      return true;
    }
    //默认老计算器
    return false;
  }

  getImageSrc = (selectedProduct, selectedCategory, isCustomLab) => {
    if (isCustomLab) {
      return customeLabSrc;
    }
    if (selectedProduct && selectedProduct.imageNamePath) {
      return template(PRODUCT_BANNER_IMAGE_PC, {
        baseUrl: this.getWWWorigin(),
        imageNamePath: selectedProduct.imageNamePath,
      });
    }
    if (selectedCategory && selectedCategory.category_code) {
      return template(CREATE_NEW_PROJECT_IMAGE_URL, {
        imagePath: selectedCategory.category_code,
        baseUrl: this.getWWWorigin(),
      });
    }
    return '';
  };

  render() {
    const {
      labsData,
      categoryProductData,
      selectedCategory,
      selectedProduct,
      calculatorData,
      isCustomLab,
      productsList,
    } = this.state;

    return (
      <div className="create-new-project-container">
        <div className="create-new-project-calculator">
          <div className="option-wrap">
            {labsData &&
              labsData.length > 0 &&
              this.getRenderLabCategoryProduct(categoryProductData, productsList)}
            {!this.getIsNewCalculatorProduct() &&
              calculatorData &&
              calculatorData.selectionList.length > 0 &&
              this.getRenderOptions()}

            {this.getIsNewCalculatorProduct() &&
              selectedProduct.product_code &&
              this.props.selectionList.length > 0 &&
              this.getNewRenderSelect()}

            {isCustomLab && selectedProduct.product_code && this.getRenderCustomOptions()}
          </div>

          {this.getRenderTitle()}

          {!isCustomLab && this.getAdditionalInfo()}
        </div>

        <div className="create-new-project-image">
          <img src={this.getImageSrc(selectedProduct, selectedCategory, isCustomLab)} />
        </div>
      </div>
    );
  }
}

// eslint-disable-next-line new-cap
export default CalculatorControl(CreateNewProduct);
