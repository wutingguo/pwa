import React from 'react';
import { componentNameMap } from '@resource/components/XFormComponent';
import { NAME_REG, NAME_CN_REG } from '@resource/lib/constants/reg';
import { customerSpreadsType } from '@resource/lib/constants/strings';
import sizeTip from './sizeTip.png';

export const customSettingKey = {
  category: 'category_id',
  productName: 'product_name',
  width: 'spec.width',
  height: 'spec.height',
  dpi: 'spec.dpi',
  unit: 'spec.unit',
  bleedLine: 'spec.bleed',
  safeLine: 'spec.safeZone',
  pages: 'spec.sheetNumberRange',
  description: 'description',
  spreadsType: 'spec.spreadsType'
};

export const customSettingUnitOptions = [
  {
    value: 'inch',
    label: t('LABS_INCHES')
  },
  {
    value: 'mm',
    label: t('LABS_MM')
  },
  {
    value: 'px',
    label: t('LABS_PIXEL')
  },
  {
    value: 'cm',
    label: t('LABS_CM')
  }
];

export const customSheetNumberRange = {
  min: 5,
  max: 50
};

const getCustomSettingPageOptions = currentSpreadsType => {
  const pageStep = 2;
  const { min, max } = customSheetNumberRange;
  const isSingle = currentSpreadsType === customerSpreadsType.singleFirstLast;
  const end = isSingle ? max - 1 : max;
  const pagesList = [];
  for (let i = min; i <= end; i++) {
    const page = {
      label: `${i * pageStep} ${t('PAGES')}`,
      value: i
    };
    pagesList.push(page);
  }
  return pagesList;
};

export const precisionMap = {
  px: 0,
  inch: 6,
  mm: 0,
  cm: 2,
  undefined: undefined
};

const required = name => ({
  required: true,
  message: `${name} ${t('VERIFY_FIELD_REQUIRED_MSG')}`
});

const customSetting = [
  {
    key: customSettingKey.category,
    label: t('CATEGORY'),
    component: componentNameMap.SelectV1,
    componentProps: {
      placeholder: t('SELECT_CATEGORY'),
      className: 'x-labs-select',
      labelInValue: false
    },
    rules: [required(t('CATEGORY'))]
  },
  {
    key: customSettingKey.productName,
    label: t('PRODUCT_NAME'),
    component: componentNameMap.Input,
    componentProps: {
      placeholder: t('PRODUCT_NAME'),
      max: 50
    },
    rules: [
      required(t('PRODUCT_NAME')),
      {
        pattern: __isCN__ ? NAME_CN_REG : NAME_REG,
        message: t('VERIFY_PRODUCT_NAME_ALLOWED_INPUT_MSG')
      }
    ]
  },
  {
    key: customSettingKey.unit,
    // label: t('UNITS'),
    component: componentNameMap.SelectV1,
    componentProps: {
      placeholder: t('PLEASE_SELECT'),
      options: customSettingUnitOptions,
      labelInValue: false
    },
    rules: [required(t('UNITS'))]
  },
  {
    key: customSettingKey.width,
    label: '',
    component: componentNameMap.InputNumber,
    componentProps: {
      placeholder: t('WIDTH'),
      min: 1
    },
    rules: [required(t('WIDTH'))]
  },
  {
    key: customSettingKey.height,
    label: __isCN__ ? t('内页(跨页)尺寸') : t('SPREAD'),
    component: componentNameMap.InputNumber,
    componentProps: {
      placeholder: t('HEIGHT'),
      min: 1
    },
    rules: [required(t('HEIGHT'))]
  },
  {
    key: customSettingKey.spreadsType,
    label: t('SPREADS_TYPE'),
    component: componentNameMap.RadioGroup
  },
  {
    key: customSettingKey.bleedLine,
    label: t('BLEED_LINE'),
    component: componentNameMap.InputNumber,
    componentProps: {
      placeholder: t('BLEED_LINE'),
      min: 0
    },
    rules: [required(t('BLEED_LINE'))]
  },
  {
    key: customSettingKey.safeLine,
    label: __isCN__ ? '安全线(若无，默认为0)' : t('SAFE_LINE'),
    component: componentNameMap.InputNumber,
    componentProps: {
      placeholder: t('SAFE_LINE'),
      min: 0
    },
    rules: [required(t('SAFE_LINE'))]
  },
  {
    key: customSettingKey.dpi,
    label: __isCN__ ? 'DPI(建议使用300，出图更高清，厂家可正常印刷)' : t('DPI_LABEL'),
    component: componentNameMap.InputNumber,
    componentProps: {
      placeholder: t('DPI_1'),
      min: 1
    },
    rules: [required(t('DPI_1'))]
  },
  {
    key: customSettingKey.pages,
    label: t('PAGES'),
    component: componentNameMap.SelectV1,
    componentProps: {
      className: 'x-labs-select',
      placeholder: t('PLEASE_SELECT'),
      labelInValue: false
    },
    rules: [required(t('PAGES'))]
  },
  {
    key: customSettingKey.description,
    label: t('LABS_DESCRIPTION'),
    component: componentNameMap.TextArea,
    componentProps: {
      max: 1000
    }
  }
];

function getSingleConfigByKey(key) {
  if (typeof key === 'string') {
    return customSetting.find(item => item.key === key);
  } else if (typeof key === 'object') {
    const config = customSetting.find(item => item.key === key.key);
    if (config) {
      const obj = {
        ...config,
        ...key
      };
      if (typeof config.componentProps === 'object') {
        obj.componentProps = {
          ...config.componentProps,
          ...obj.componentProps
        };
      }
      if (key.rules) {
        obj.rules = [...(config.rules || []), ...obj.rules];
      }
      return obj;
    }
    return key;
  }
}

function getConfig(params = []) {
  return params.map(key => {
    if (typeof key === 'object' && Array.isArray(key.componentArray)) {
      key.componentArray = key.componentArray.map(childKey => getSingleConfigByKey(childKey));
      return key;
    }
    return getSingleConfigByKey(key);
  });
}

const getFormItemConfigKeys = ({
  categoryList,
  currentUnit,
  precisionByUnit,
  productNameList,
  convertValue,
  handleChangePixel,
  formRef,
  currentSpreadsType
}) => {
  const validatorNumber = ({ convert = true, maxPx, message }) => {
    const max = convert ? convertValue(maxPx, 'px', currentUnit) : maxPx;
    return {
      validator(rule, value, callback) {
        if (typeof value === 'number' && value > max) {
          callback(message);
        }
        callback();
      }
    };
  };
  const validatorbleed = ({ message }) => {
    return {
      validator(rule, value, callback) {
        if (formRef) {
          const currentWidth = formRef.getFieldsValue()[customSettingKey.width];
          const currentHeight = formRef.getFieldsValue()[customSettingKey.height];
          if (value * 6 > currentWidth || value * 6 > currentHeight) {
            callback(message);
          }
        }
        callback();
      }
    };
  };
  const category = {
    className: 'requiredTip category',
    key: customSettingKey.category,
    componentProps: {
      options: categoryList
    }
  };
  const productName = {
    className: 'requiredTip productName',
    key: customSettingKey.productName,
    rules: [
      {
        validator(rule, value, callback) {
          let message = undefined;
          let productList = productNameList;
          if (formRef) {
            const currentCateId = formRef.getFieldsValue()[customSettingKey.category];
            const currentCate = categoryList.filter(i => i.value === currentCateId);
            if (currentCate && currentCate[0] && currentCate[0].productList) {
              productList = currentCate[0].productList.map(i => i.product_name);
            }
          }
          if (productList.find(name => name == value)) {
            message = t('VERIFY_PRODUCT_NAME_DUPLICATE_MSG');
          }
          callback(message);
        }
      }
    ]
  };
  const size = {
    className: 'requiredTip',
    componentArray: [
      {
        key: customSettingKey.height,
        icon: __isCN__ ? 'help' : null,
        toolTip: <img width={300} src={sizeTip} />,
        componentProps: {
          className: `x-input-select half ${__isCN__ ? 'height-label' : ''}`,
          precision: precisionByUnit
        },
        rules: [
          validatorNumber({
            maxPx: 12000,
            message: t('VERIFY_HEIGHT_CORRECT_MSG')
          })
        ]
      },
      {
        key: customSettingKey.unit,
        componentProps: {
          className: 'x-labs-select',
          onChange: handleChangePixel
        }
      },
      {
        key: customSettingKey.width,
        componentProps: {
          className: `x-input-select half ${__isCN__ ? 'width-label' : ''}`,
          precision: precisionByUnit
        },
        rules: [
          validatorNumber({
            maxPx: 12000,
            message: t('VERIFY_WIDTH_CORRECT_MSG')
          })
        ]
      },
      {
        key: customSettingKey.unit,
        componentProps: {
          className: 'x-labs-select',
          onChange: handleChangePixel
        }
      }
    ]
  };
  const spreadsType = {
    className: 'requiredTip custom-setting-spreadsType',
    key: customSettingKey.spreadsType,
    componentProps: {
      name: 'spreadsType',
      options: [
        {
          value: customerSpreadsType.spreadsOnly,
          label: t('SPREADS_ONLY')
        },
        {
          value: customerSpreadsType.singleFirstLast,
          label: t('SINGLE_FIRST_LAST')
        }
      ]
    }
  };
  const bleedLine = {
    componentArray: [
      {
        key: customSettingKey.bleedLine,
        icon: 'help',
        toolTip: t('BLEED_TOOL_TIP'),
        componentProps: {
          className: 'x-input-select',
          precision: precisionByUnit
        },
        rules: [
          validatorNumber({
            maxPx: 3000,
            message: t('VERIFY_BLEED_LINE_CORRECT_MSG')
          }),
          validatorbleed({
            message: t('VERIFY_BLEED_LINE_IM_MSG')
          })
        ]
      },
      {
        key: customSettingKey.unit,
        componentProps: {
          className: 'x-labs-select',
          onChange: handleChangePixel
        }
      }
    ]
  };
  const safeLine = {
    componentArray: [
      {
        key: customSettingKey.safeLine,
        icon: 'help',
        toolTip: t('SAFE_LINE_TOOL_TIP'),
        componentProps: {
          className: 'x-input-select',
          precision: precisionByUnit
        },
        rules: [
          validatorNumber({
            maxPx: 3000,
            message: t('VERIFY_SAFE_LINE_CORRECT_MSG')
          }),
          validatorbleed({
            message: t('VERIFY_SAFE_LINE_IM_MSG')
          })
        ]
      },
      {
        key: customSettingKey.unit,
        componentProps: {
          className: 'x-labs-select',
          onChange: handleChangePixel
        }
      }
    ]
  };
  const dpi = {
    className: 'requiredTip',
    key: customSettingKey.dpi,
    rules: [
      validatorNumber({
        convert: false,
        maxPx: 1200,
        message: t('VERIFY_DPI_CORRECT_MSG')
      })
    ]
  };
  const pages = {
    key: customSettingKey.pages,
    componentProps: {
      options: getCustomSettingPageOptions(currentSpreadsType)
    }
  };
  const description = {
    className: 'custom-setting-description',
    key: customSettingKey.description
  };

  if (__isCN__) {
    return [category, productName, size, bleedLine, safeLine, dpi, pages, description];
  }
  return [category, productName, size, spreadsType, bleedLine, safeLine, dpi, pages, description];
};

export const getFormConfig = params => {
  const keys = getFormItemConfigKeys(params);
  return getConfig(keys);
};

export const formInitialValue = category => ({
  [customSettingKey.category]: category,
  // [customSettingKey.unit]: __isCN__ ? 'cm' : 'inch',
  [customSettingKey.unit]: 'inch',
  [customSettingKey.dpi]: 300,
  [customSettingKey.bleedLine]: 0,
  [customSettingKey.safeLine]: 0,
  [customSettingKey.pages]: customSheetNumberRange.min,
  [customSettingKey.spreadsType]: customerSpreadsType.spreadsOnly
});
