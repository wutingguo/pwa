import {componentNameMap} from '@resource/components/XFormComponent';
import {NAME_REG, NAME_CN_REG} from '@resource/lib/constants/reg';

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
  description: 'description'
}

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
  }
];

export const customSheetNumberRange = {
  min: 5,
  max: 50
}

const getCustomSettingPageOptions = () => {
  const pageStep = 2;
  const { min, max } = customSheetNumberRange;
  const pagesList = [];
  for(let i = min; i <= max; i++) {
    const page = {
      label: `${i * pageStep} ${t('PAGES')}`,
      value: i
    };
    pagesList.push(page);
  }
  return pagesList;
}

const customSettingPageOptions = [
  {
    value: 10,
    label: 10
  }
];

export const precisionMap = {
  px: 0,
  inch: 6,
  mm: 0,
  undefined: undefined
}

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
    label: t('UNITS'),
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
    label: t('SPREAD'),
    component: componentNameMap.InputNumber,
    componentProps: {
      placeholder: t('WIDTH'),
      min: 1
    },
    rules: [
      required(t('WIDTH'))
    ]
  },
  {
    key: customSettingKey.height,
    className: 'custom-setting-height',
    component: componentNameMap.InputNumber,
    componentProps: {
      placeholder: t('HEIGHT'),
      min: 1
    },
    rules: [
      required(t('HEIGHT'))
    ]
  },
  {
    key: customSettingKey.bleedLine,
    label: t('BLEED_LINE'),
    component: componentNameMap.InputNumber,
    componentProps: {
      placeholder: t('BLEED_LINE'),
      min: 0
    },
    rules: [
      required(t('BLEED_LINE'))
    ]
  },
  {
    key: customSettingKey.safeLine,
    label: t('SAFE_LINE'),
    component: componentNameMap.InputNumber,
    componentProps: {
      placeholder: t('SAFE_LINE'),
      min: 0
    },
    rules: [
      required(t('SAFE_LINE'))
    ]
  },
  {
    key: customSettingKey.dpi,
    label: t('DPI'),
    component: componentNameMap.InputNumber,
    componentProps: {
      placeholder: t('DPI_1'),
      min: 1,
      precision: 0
    },
    rules: [
      required(t('DPI'))
    ]
  },
  {
    key: customSettingKey.pages,
    label: t('PAGES'),
    component: componentNameMap.SelectV1,
    componentProps: {
      className: 'x-labs-select',
      placeholder: t('PLEASE_SELECT'),
      options: getCustomSettingPageOptions(),
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
  if(typeof key === 'string') {
    return customSetting.find(item => item.key === key);
  }else if(typeof key === 'object') {
    const config = customSetting.find(item => item.key === key.key);
    if(config) {
      const obj = {
        ...config,
        ...key
      }
      if(typeof config.componentProps === 'object') {
        obj.componentProps = {
          ...config.componentProps,
          ...obj.componentProps
        }
      }
      if(key.rules) {
        obj.rules = [
          ...(config.rules || []),
          ...obj.rules
        ];
      }
      return obj;
    }
    return key;
  }
}

function getConfig(params=[]) {
  return params.map(key => {
    if(typeof key === 'object' && Array.isArray(key.componentArray)) {
      key.componentArray = key.componentArray.map(childKey => getSingleConfigByKey(childKey));
      return key;
    }else {
      return getSingleConfigByKey(key);
    }
  });
}

const getFormItemConfigKeys = ({categoryList, currentUnit, precisionByUnit, productNameList, convertValue, handleChangePixel}) => {
  const validatorNumber = ({convert=true, maxPx, message}) => {
    const max = convert ? convertValue(maxPx, 'px', currentUnit) : maxPx;
    return {
      validator(rule, value, callback) {
        if(typeof value === 'number' && value > max) {
          callback(message);
        }
        callback();
      }
    }
  }
  const config = [
    {
      key: customSettingKey.category,
      componentProps: {
        options: categoryList
      }
    },
    {
      key: customSettingKey.productName,
      rules: [
        {
          validator(rule, value, callback) {
            let message = undefined;
            if(productNameList.find(name => name == value)) {
              message = t('VERIFY_PRODUCT_NAME_DUPLICATE_MSG')
            }
            callback(message);
          }
        }
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
      key: customSettingKey.height,
      componentProps: {
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
      key: customSettingKey.bleedLine,
      componentProps: {
        precision: precisionByUnit
      },
      rules: [
        validatorNumber({
          maxPx: 3000,
          message: t('VERIFY_BLEED_LINE_CORRECT_MSG')
        })
      ]
    },
    {
      key: customSettingKey.safeLine,
      componentProps: {
        precision: precisionByUnit
      },
      rules: [
        validatorNumber({
          maxPx: 3000,
          message: t('VERIFY_SAFE_LINE_CORRECT_MSG')
        })
      ]
    },
    {
      key: customSettingKey.dpi,
      rules: [
        validatorNumber({
          convert: false,
          maxPx: 1200,
          message: t('VERIFY_DPI_CORRECT_MSG')
        })
      ]
    },
    customSettingKey.pages,
    {
      className: 'custom-setting-description',
      key: customSettingKey.description
    }
  ];
  return config;
}


export const getFormConfig = (params) => {
  const keys = getFormItemConfigKeys(params);
  return getConfig(keys);
}

export const formInitialValue = (category) => ({
  [customSettingKey.category]: category,
  [customSettingKey.unit]: 'inch',
  [customSettingKey.dpi]: 300,
  [customSettingKey.bleedLine]: 0,
  [customSettingKey.safeLine]: 0,
  [customSettingKey.pages]: customSheetNumberRange.min
});