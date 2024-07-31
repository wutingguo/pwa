import React, { Component } from 'react';
import calculatorControl from '@resource/components/CalculatorControl';
import XLoading from '@resource/components/XLoading';
import { needJumpPageUrlMap } from '@resource/lib/constants/strings';
import customeLabSrc from './img/customer-lab.jpg';

import {
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
} from './handler';

import {
  getRenderLabSelect,
  getRenderCategorySelect,
  getRenderProductSelect,
  getRenderOptionSelect,
  getRenderTitle,
  getRenderLabCategoryProduct,
  getRenderOptions,
  getNewRenderSelect,
  getAdditionalInfo,
  onTitleChange,
  onLabChange,
  onCategoryChange,
  onProductChange,
  onOptionChange,
  handleNewSelectChange,
  onClearSelectedCategory,
  onClearSelectedProduct,
  getRenderCustomOptions,
  handleCustomParamsChange
} from './renderHelper';

import './index.scss';

class CreateNewProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryProductData: [],
      productsList: [],
      labsData: [],
      selectedLab: {},
      selectedCategory: {},
      selectedProduct: {},
      selectedState: [],
      optionTip: '',
      startButtonClicked: false,
      title: t('DEFAULT_TITLE'),
      imgUrl: '',
      calculatorLoading: false
    };

    this.getRenderTitle = () => getRenderTitle(this);
    this.getRenderOptionSelect = (list, selectedIndex) =>
      getRenderOptionSelect(this, list, selectedIndex);
    this.getRenderCategorySelect = (list, selectedCategory) =>
      getRenderCategorySelect(this, list, selectedCategory);
    this.getRenderProductSelect = (list, selectedProduct) =>
      getRenderProductSelect(this, list, selectedProduct);
    this.getRenderOptions = () => getRenderOptions(this);
    this.getRenderLabCategoryProduct = (categoryList, productsList) =>
      getRenderLabCategoryProduct(this, categoryList, productsList);
    this.getNewRenderSelect = () => getNewRenderSelect(this);
    this.onCategoryChange = (list, selected) => onCategoryChange(this, list, selected);
    this.onProductChange = (list, selected) => onProductChange(this, list, selected);
    this.onOptionChange = (list, key, selected) => onOptionChange(this, list, key, selected);
    this.onTitleChange = e => onTitleChange(this, e);
    this.onLabChange = (list, selected) => onLabChange(this, list, selected);
    this.handleNewSelectChange = (key, params) => handleNewSelectChange(this, key, params);
    this.onClearSelectedCategory = () => onClearSelectedCategory(this);
    this.onClearSelectedProduct = () => onClearSelectedProduct(this);
    this.getRenderCustomOptions = () => getRenderCustomOptions(this);

    this.getLabs = () => getLabs(this);
    this.getCategoryProduct = () => getCategoryProduct(this);
    this.getCustomCategoryProduct = selectedLab => getCustomCategoryProduct(this, selectedLab);
    this.getCustomProductsList = (selectedCategory, labId) =>
      getCustomProductsList(this, selectedCategory, labId);
    this.handleCustomParamsChange = (key, select) => handleCustomParamsChange(this, key, select);
    this.getProductsList = category => getProductsList(this, category);
    this.initCalculatorData = () => initCalculatorData(this);
    this.getSelectedValues = () => getSelectedValues(this);
    this.getCurrencyPrice = pageAdded => getCurrencyPrice(this, pageAdded);
    this.updatePriceInState = params => updatePriceInState(this, params);
    this.buildMakeParams = () => buildMakeParams(this);
    this.handleMakeClick = e => handleMakeClick(this, e);
    this.getCurrentItem = () => getCurrentItem(this);
    this.getAdditionalInfo = () => getAdditionalInfo(this);
    this.getIsNewCalculatorProduct = () => getIsNewCalculatorProduct(this);
    this.getIsNeedJumpProduct = () => getIsNeedJumpProduct(this);
    this.getRenderLabSelect = (list, selectedLab) => getRenderLabSelect(this, list, selectedLab);
    this.getCurrentSkuCode = () => getCurrentSkuCode(this);
    this.getVisualType = (skuCode, cb) => getVisualType(this, skuCode, cb);
    this.getImgUrl = (url, imagePath, isCustomLab) => getImgUrl(this, url, imagePath, isCustomLab);
    this.getWWWorigin = () => getWWWorigin(this);
  }

  componentDidMount() {
    const { getInstance } = this.props;
    if (typeof getInstance === 'function') {
      getInstance(this);
    }
    this.getLabs();
  }

  render() {
    const {
      imgUrl,
      productsList,
      calculatorData,
      categoryProductData,
      selectedProduct,
      isCustomLab,
      calculatorLoading: isShowLoading
    } = this.state;

    const { calculatorLoading, selectionList } = this.props;

    const isUseNewCalculator = this.getIsNewCalculatorProduct();
    const isNeedJump = this.getIsNeedJumpProduct();

    const isShown = isShowLoading || calculatorLoading;

    return (
      <div className="create-new-project-container">
        <div className="create-new-project-image">
          <img src={imgUrl} alt="" />
        </div>

        <div className="create-new-project-calculator">
          <div className="option-wrap">
            {this.getRenderLabCategoryProduct(categoryProductData, productsList)}

            {/* 兼容老价格计算器渲染 */}
            {!isUseNewCalculator &&
              calculatorData &&
              !!calculatorData.selectionList.length &&
              this.getRenderOptions()}

            {isUseNewCalculator &&
              !isNeedJump &&
              !!selectionList.length &&
              this.getNewRenderSelect()}
            {isCustomLab && selectedProduct.product_code && this.getRenderCustomOptions()}
          </div>

          {this.getRenderTitle()}

          {this.getAdditionalInfo()}

          <XLoading isShown={isShown} type="imageLoading" isCalculate={true} size="lg" />
        </div>
      </div>
    );
  }
}

export default calculatorControl(CreateNewProduct);
