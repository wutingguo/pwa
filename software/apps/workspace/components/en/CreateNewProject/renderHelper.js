import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { isString } from 'lodash';
import { absoluteUrl } from '@resource/lib/utils/language';
import XSelect from '@resource/websiteCommon/components/dom/XSelect';
import {
  hideCategoryCodeMap,
  hideProductCodeMap,
  hideOptionKeys,
  usCustomUnitLabelMap
} from '@apps/workspace/constants/strings';
import {
  sortSizeOptions,
  filterTextureOptions,
  enableCoverOptions
} from '@resource/lib/utils/convertOptions';
import {
  CREATE_NEW_PROJECT_CATEGORY_IMAGE_URL,
  CREATE_NEW_PROJECT_PRODUCT_IMAGE_URL,
  NEW_CUSTOME_PRODUCT_LIST
} from '../../../constants/apiUrl';

import { fetchCalculateInfo } from '../../../utils/calculator';

import check_red from './img/check_red.png';
import check_green from './img/check_green.png';
import check_blank from './img/check_blank.png';

const getRenderLabSelect = (that, list, selectedLab) => {
  let labList = list.map(m => {
    return {
      value: m.value,
      label: t(m.label)
    };
  });
  return (
    <div className="select-container">
      <div className="select-name">{t('LAB')}</div>
      <XSelect
        id="select-labs"
        searchable={false}
        clearable={false}
        options={labList}
        value={selectedLab.value}
        onChanged={value => that.onLabChange(labList, value)}
        placeholder=""
      />
      {selectedLab.label && <img className="input-check-icon" src={check_green} />}
    </div>
  );
};

const getRenderCategorySelect = (that, list, selectedCategory) => {
  const categoryList = list
    .filter(o => !hideCategoryCodeMap.includes(o.category_code))
    .map(m => ({
      value: m.category_code,
      label: m.category_name,
      categoryImageUrl: m.categoryImageUrl
    }));

  return (
    <div className="select-container">
      <div className="select-name">{t('CATEGORY')}</div>

      <XSelect
        id="select-category"
        searchable={false}
        clearable={false}
        options={categoryList}
        value={selectedCategory.category_code}
        onChanged={value => that.onCategoryChange(list, value)}
        placeholder=""
      />

      {selectedCategory.category_code && (
        <img className="input-check-icon" src={check_green} alt="" />
      )}
    </div>
  );
};

const getRenderProductSelect = (that, list, selectedProduct) => {
  const { startButtonClicked } = that.state;

  const productList = list.reduce((acc, cur) => {
    const { product_code: value } = cur;
    const label = cur.displayName || cur.product_name;
    if (hideProductCodeMap.includes(value)) return acc;
    acc.push({ value, label });
    return acc;
  }, []);

  console.log('selectedProduct', selectedProduct, productList);

  const selectedValue = selectedProduct ? selectedProduct.product_code : '';

  return (
    <div className="select-container">
      <div className="select-name">{t('PRODUCT')}</div>

      <XSelect
        id="select-product"
        searchable={false}
        clearable={false}
        options={productList}
        value={selectedValue}
        onChanged={value => that.onProductChange(list, value)}
        placeholder={t('SELECT_PRODUCT')}
      />

      <img
        className="input-check-icon"
        src={startButtonClicked ? (selectedValue ? check_green : check_red) : check_blank}
        alt=""
      />
    </div>
  );
};

const getRenderTitle = that => {
  return (
    <div className="title-container">
      <div className="title-name">{t('LAB_PRODUCT_TITLE')}</div>
      <input
        className="title-field"
        value={that.state.title}
        // onFocus={that.onTitleFocus.bindthat}
        onChange={that.onTitleChange}
      />
    </div>
  );
};

const getRenderLabCategoryProduct = (that, categoryList, productsList) => {
  const { labsData, selectedLab, selectedCategory, selectedProduct } = that.state;
  const html = [];
  html.push(that.getRenderLabSelect(labsData, selectedLab));
  if (categoryList && categoryList.length) {
    html.push(that.getRenderCategorySelect(categoryList, selectedCategory));
  }

  if (productsList && productsList.length) {
    html.push(that.getRenderProductSelect(productsList, selectedProduct));
  }
  return html;
};

const getRenderOptions = that => {
  const html = [];
  const { selectedState } = that.state;
  const { calculatorData } = that.state;
  const { selectionList } = calculatorData;
  const key = selectionList[0].optionKey;
  const currentState =
    selectedState.find(s => {
      return s.key === key;
    }) || {};
  const { index = 0 } = currentState;
  html.push(that.getRenderOptionSelect(selectionList, index));
  let currentList = selectionList[index];
  while (currentList.childNodes && currentList.childNodes.length) {
    const childList = currentList.childNodes;
    const key = childList[0].optionKey;
    const currentState =
      selectedState.find(s => {
        return s.key === key;
      }) || {};
    const { index = 0 } = currentState;
    html.push(that.getRenderOptionSelect(currentList.childNodes, index));
    currentList = childList[index] || childList[0];
  }
  return html;
};

const getNewRenderSelect = that => {
  const { currentOptions, selectionList, root_product_code } = that.props;
  return selectionList.map(key => {
    const { productOrder, option_name: displayName, option_key, options } = key;
    const selectedOrder = currentOptions[`order_${productOrder}`];
    const selectedValue = selectedOrder[option_key];

    if (hideOptionKeys.includes(option_key)) {
      return null;
    }

    const sortedSizeOptionsArray = sortSizeOptions(option_key, options, root_product_code);
    const filterTextureOptionsArray = filterTextureOptions(
      option_key,
      true,
      sortedSizeOptionsArray
    );

    const optionsList = filterTextureOptionsArray.reduce((acc, cur) => {
      const { value_id: value, value_name: label } = cur;

      // 过滤部分 空值 none NULL 值属性，不展示
      if (!value || (isString(value) && (value.startsWith('none') || value.startsWith('NULL'))))
        return acc;

      acc.push({ value, label });
      return acc;
    }, []);

    if (!optionsList.length) return null;

    return (
      <div className="select-container">
        <div className="select-name">{displayName}</div>
        <XSelect
          id={`select-options-${productOrder}-${option_key}`}
          searchable={false}
          clearable={false}
          options={optionsList}
          value={selectedValue}
          onChanged={value => that.handleNewSelectChange(key, value)}
          placeholder=""
        />
      </div>
    );
  });
};

const getRenderOptionSelect = (that, list, selectedIndex) => {
  const { calculatorData } = that.state;
  const { selectionNames, selectionDisplayNames } = calculatorData;
  const key = list[0].optionKey;
  const index = selectionNames.findIndex(name => name === key);
  console.log('list: ', list);

  const displayName = selectionDisplayNames[index];

  const optionsList = list.map(m => {
    return {
      value: m.value,
      label: m.displayName
    };
  });

  let selectedValue;
  if (selectedIndex >= 0) {
    const index = selectedIndex < list.length ? selectedIndex : 0;
    selectedValue = list[index].value;
  }

  const isEmptyItem = !!list.find(v => !v.displayName);
  const optionClassName = classNames('select-container', {
    none: isEmptyItem
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
        onChanged={value => that.onOptionChange(list, key, value)}
        placeholder=""
      />
    </div>
  );
};

const getAdditionalInfo = that => {
  const { selectedProduct } = that.state;
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
};

const onTitleChange = (that, event) => {
  const { value } = event.target;
  that.setState({
    title: value,
    titleTip: '',
    commonErrorTip: ''
  });
};

// const onLabChange = (that, list, selected) => {
//   const selectedLab = list.find(item => {
//     return item.value === selected.value;
//   });
//   if (selectedLab) {
//     that.setState(
//       {
//         selectedLab,
//       },
//       () => {
//         that.getCategoryProduct();
//         that.onClearSelectedCategory();
//         that.onClearSelectedProduct();
//       }
//     );
//   }
// };
const onLabChange = (that, list, selected) => {
  const selectedLab = that.state.labsData.find(item => {
    return item.value === selected.value;
  });
  const { selectedProduct } = that.state;
  const isCustomLab = selectedLab.value !== 0;
  if (selectedLab) {
    that.setState(
      {
        selectedLab,
        isCustomLab,
        selectedProduct: {},
        imgUrl: that.getImgUrl(
          CREATE_NEW_PROJECT_PRODUCT_IMAGE_URL,
          selectedProduct.imagePathNewCreate,
          isCustomLab
        )
      },
      () => {
        that.onClearSelectedCategory();
        if (isCustomLab) {
          that.getCustomCategoryProduct(selectedLab);
        } else {
          that.getCategoryProduct(selectedLab);
        }
      }
    );
  }
};

const onCategoryChange = (that, list, selected) => {
  const { isCustomLab, selectedLab } = that.state;
  const { id: labId } = selectedLab;
  const selectedCategory = list.find(item => {
    return item.category_code === selected.value;
  });
  if (selectedCategory) {
    that.setState(
      {
        selectedCategory,
        imgUrl: that.getImgUrl(
          CREATE_NEW_PROJECT_CATEGORY_IMAGE_URL,
          selectedCategory.categoryImageUrl,
          isCustomLab
        )
      },
      () => {
        that.onClearSelectedProduct();
        if (isCustomLab) {
          that.getCustomProductsList(selectedCategory, labId);
          return;
        }
        that.getProductsList(selectedCategory);
      }
    );
  }
};
const getRenderCustomOptions = that => {
  const {
    selectedProduct: {
      spec: { sheetNumberRange, bleed, dpi, width, height, unit, safeZone }
    },
    customParams
  } = that.state;

  // const unitLabel = t('LABS_INCHES_NEW');
  const unitLabel = usCustomUnitLabelMap[unit];

  let pageOptions = [];
  for (let i = sheetNumberRange.min; i <= sheetNumberRange.max; i++) {
    pageOptions.push({
      value: i,
      label: `${i * 2} pages`
    });
  }

  return (
    <Fragment>
      <div className="title-container">
        <div className="title-name">Spread</div>
        <input
          className="title-field disabled"
          value={`Height (${height}${unitLabel}) × Width (${width}${unitLabel})`}
          disabled={true}
        />
      </div>
      <div className="title-container">
        <div className="title-name">Bleed Line({unitLabel})</div>
        <input className="title-field disabled" value={bleed} disabled={true} />
      </div>
      <div className="title-container">
        <div className="title-name">Safe Line({unitLabel})</div>
        <input className="title-field disabled" value={safeZone} disabled={true} />
      </div>
      <div className="title-container">
        <div className="title-name">DPI</div>
        <input className="title-field disabled" value={dpi} disabled={true} />
      </div>
      <div className="select-container">
        <div className="select-name">Pages</div>
        <XSelect
          id={`select-options-custom-pages`}
          searchable={false}
          clearable={false}
          options={pageOptions}
          value={customParams.countPages}
          onChanged={value => that.handleCustomParamsChange('countPages', value)}
          placeholder=""
        />
      </div>
    </Fragment>
  );
};
const handleCustomParamsChange = (that, key, select) => {
  that.setState({
    customParams: {
      ...that.state.customParams,
      [key]: select.value
    }
  });
};

const onProductChange = (that, list, selected) => {
  const { isCustomLab } = that.state;
  const selectedProduct = list.find(item => {
    return item.product_code === selected.value;
  });
  let customParams = {};
  if (isCustomLab) {
    customParams.countPages = selectedProduct.spec.sheetNumberRange.current;
  }
  that.setState(
    {
      selectedProduct,
      imgUrl: that.getImgUrl(
        CREATE_NEW_PROJECT_PRODUCT_IMAGE_URL,
        selectedProduct.imagePathNewCreate,
        isCustomLab
      ),
      customParams
    },
    () => {
      if (that.getIsNewCalculatorProduct()) {
        that.props.updateOptionsData(selectedProduct.product_code, []);
        return false;
      }

      // 获取该产品的价格计算器数据
      // TIPS: 调用老的option树
      // fetchCalculateInfo({
      //   product: selectedProduct.product_code,
      //   baseUrl
      // }).then(rawData => {
      //   const calculatorData = formatWeddingBookCalculateInfo(rawData);
      //   that.setState(
      //     {
      //       calculatorData
      //     },
      //     () => {
      //       that.initCalculatorData(() => {
      //         that.getCurrencyPrice(0).then(rawData => {
      //           that.updatePriceInState(rawData);
      //         });
      //         const currentItem = that.getCurrentItem();
      //         const { optionTip } = currentItem;
      //         that.setState({
      //           optionTip
      //         });
      //       });
      //     }
      //   );
      // });
    }
  );
};

const onOptionChange = (that, list, key, selected) => {
  const selectedIndex = list.findIndex(item => {
    return item.value === selected.value;
  });

  const { selectedState } = that.state;
  const makeParams = that.buildMakeParams();
  const { product } = makeParams;

  logEvent.addPageEvent({
    name: 'US_PC_ProductPage_Click_SelectOptionValue',
    product,
    key,
    value: selectedIndex
  });

  const newState = selectedState.map((m, index) => {
    if (m.key === key) {
      return Object.assign({}, m, {
        index: selectedIndex
      });
    }

    return m;
  });

  that.setState(
    {
      selectedState: newState
    },
    () => {
      that.getCurrencyPrice(0).then(rawData => {
        that.updatePriceInState(rawData);
      });
      const currentItem = that.getCurrentItem();

      const { optionTip } = currentItem;
      that.setState({
        optionTip
      });
    }
  );
};

const handleNewSelectChange = (that, key, { value, label }) => {
  const newOptions = {
    [key.option_key]: value
  };
  that.props.setCurrentOptions(key, newOptions);
};

const onClearSelectedCategory = that => {
  that.setState({
    selectedCategory: {},
    selectedProduct: {},
    calculatorData: null,
    currentPrice: null
  });
};

const onClearSelectedProduct = that => {
  that.setState({
    selectedProduct: {},
    calculatorData: null,
    currentPrice: null
  });
};

export {
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
};
