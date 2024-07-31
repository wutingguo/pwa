import { template } from 'lodash';
import React, { Component } from 'react';

import {
  defaultCurrencyInfo,
  getCountryCode,
  getCurrencyInfoFromCookie,
} from '@resource/lib/utils/currency';
import { getLanguageCode } from '@resource/lib/utils/language';
import { getWWWorigin } from '@resource/lib/utils/url';
import * as xhr from '@resource/lib/utils/xhr';

import {
  ESTORE_SAVE_ADDRESS,
  SAVE_BILLLING_ADDRESS,
  SAVE_NORMAL_ADDRESS,
  SAVE_ORDER_ADDRESS,
} from '@resource/lib/constants/apiUrl';

import { getMyAccountUserInfo } from '@common/servers/user';

import { getCountryList } from '@apps/gallery-client/services/address';

import { formItemNames } from './handler/formItemConfig';
import { getFormItemOptions } from './handler/formItemConfig';
import { getFormItemOrder } from './handler/formItemOrder';
import { getRenderFormItems } from './handler/formList';

import './index.scss';

// 过滤出只包含有效值的Object
const buildValidAddressObject = object => {
  const r = {};
  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      const element = object[key];
      if (element || element === 0) {
        r[key] = element;
      }
    }
  }
  return r;
};

class ShippingNewAddress extends Component {
  constructor(props) {
    super(props);
    // const { lang } = this.props;
    const formItemOrder = getFormItemOrder('en');
    this.state = {
      orderNumber: '',
      fullname: '',
      fullNameTip: '',
      street1: '',
      street1Tip: '',
      street2: '',
      city: '',
      cityTip: '',
      subCountry: '',
      subCountryTaxTip: '',
      subCountryTip: '',
      subCountryDisabled: false,
      stateList: [],
      country: '',
      countryTaxTip: '',
      countryDisabled: false,
      countryTip: '',
      countryList: [],
      postalCode: '',
      postalCodeTip: '',
      phoneNumber: '',
      phoneNumberTip: '',
      email: '',
      certId: '',
      emailTip: '',
      formItemOrder,
      aType: 's_a',
      requestFrom: '',
      fullDistricts: [],
      languageCode: 'en',
      countryCode: '',
      commonErrorTip: '',
      successModalShow: false,
      orderAddressWithTax: false,
      certType: '',
    };
  }

  componentDidMount() {
    const { estoreBaseUrl } = this.props;
    // const languageCode = getLanguageCode();
    // const countryCode = getCountryCode();
    const languageCode = 'en';
    const countryCode = 'US';
    this.setState({
      formItemOrder: getFormItemOrder(languageCode, countryCode),
      languageCode,
      countryCode,
    });
    getCountryList({ estoreBaseUrl }).then(data => {
      const { districts = [], top_countries = [] } = data;
      const topCountriesData = top_countries.map(topItem => {
        return districts.find(disItem => disItem['short_code'] === topItem['short_code']);
      });
      const currencyInfo = getCurrencyInfoFromCookie() || defaultCurrencyInfo;
      const { countryCode } = currencyInfo;
      const selectedCountry =
        districts.find(item => item['short_code'] === countryCode) || topCountriesData[0];
      const selectedCountryCode = selectedCountry['short_code'];
      topCountriesData.unshift({
        short_code: '------TOP------',
        en_name: '------TOP------',
        local_name: '------TOP------',
        disabled: true,
      });
      districts.unshift({
        short_code: '---------------',
        en_name: '---------------',
        local_name: '---------------',
        disabled: true,
      });
      const fullDistricts = topCountriesData.concat(districts);
      this.setState({
        fullDistricts,
        // country: selectedCountryCode
      });
    });
  }

  onInputChange(itemkey, event) {
    const { value } = event.target;
    this.setState({
      [itemkey]: value,
      [`${itemkey}Tip`]: '',
      commonErrorTip: '',
    });
  }

  onInputFocus(itemkey) {
    this.setState({
      focusKey: itemkey,
    });
  }

  onSelectChange(itemkey, itemOption) {
    const { saveAddressData, getAutomaticData, getCurrentCartData, onSelectUsOrCa } = this.props;
    if (itemkey === formItemNames.country && itemOption.value !== this.state.country) {
      this.setState({
        [formItemNames.subCountry]: '',
      });
    }
    this.setState(
      {
        [itemkey]: itemOption.value,
        [`${itemkey}Tip`]: '',
        commonErrorTip: '',
      },
      async () => {
        // 美国和加拿大需要在选择子地区后查询税率等
        // 但运费在国家层级 仍然需要查下运费
        if (['US', 'CA'].includes(itemOption.value)) {
          onSelectUsOrCa();
        }

        saveAddressData && (await saveAddressData());
        getAutomaticData && (await getAutomaticData());
        getCurrentCartData && (await getCurrentCartData(true));

        // 处理切换后的 税务问题
        if (this.state.orderNumber) {
          let countryTaxTip = '';
          let subCountryTaxTip = '';
          let newCountry = this.state.country;
          let newSubcountry = this.state.subCountry;
          if (itemkey === formItemNames.country) {
            newCountry = itemOption.value;
          } else {
            newSubcountry = itemOption.value;
          }
          switch (newCountry) {
            case 'AU':
              countryTaxTip = t('TAX_REGULATIONS_AUSTRALIAN');
              break;
            case 'NZ':
              countryTaxTip = t('TAX_REGULATIONS_NEWZEALAND');
              break;
            default:
              break;
          }
          const isTaxCity = newCountry === 'US' && newSubcountry === 'CA';
          subCountryTaxTip = isTaxCity ? t('TAX_REGULATIONS_CALIFORNIAN') : '';
          this.setState({
            subCountryTaxTip,
            countryTaxTip,
          });
        }
      }
    );
  }

  validateItem(itemKey, itemOption) {
    this.setState({
      focusKey: '',
    });

    let itemValue = this.state[itemKey];
    if (itemValue) {
      itemValue = itemValue.trim();
    }

    const { rules = [] } = itemOption;
    let validateMessage = '';
    rules.some(rule => {
      // 值不存在的时候只校验是否为必须字段
      if (!itemValue) {
        if (rule.required) {
          validateMessage = rule.message;
        }
      } else {
        const { pattern, matchWarning = false } = rule;
        if (pattern) {
          // 正则匹配会有一次 true 一次 false 的情况，每次匹配强制从头开始匹配。
          pattern.lastIndex = 0;
          const regTestResult = pattern.test(itemValue);
          const showMessage = matchWarning ? regTestResult : !regTestResult;
          if (showMessage) {
            validateMessage = rule.message;
          }
        }
      }
      return !!validateMessage;
    });
    this.setState({
      [`${itemKey}Tip`]: validateMessage,
    });
    return validateMessage;
  }

  checkAllItemValue() {
    const { languageCode, country } = this.state;
    const formItemOrder = getFormItemOrder(languageCode, country);
    console.log('formItemOrder: ', formItemOrder);
    const formItemOptions = getFormItemOptions(languageCode, country);
    console.log('formItemOptions: ', formItemOptions);
    const invalidMessageList = [];
    formItemOrder.forEach(itemKey => {
      const itemOption = formItemOptions[itemKey];
      const itemMessage = this.validateItem(itemKey, itemOption);
      if (itemMessage) {
        invalidMessageList.push({
          key: itemKey,
          message: itemMessage,
        });
      }
    });
    return !invalidMessageList.length;
  }

  getRenderFormItems = () => getRenderFormItems(this);

  getAddressFormData = () => {
    return 'formdata';
  };

  getSubmitPath() {
    const { aType } = this.state;
    let path = ESTORE_SAVE_ADDRESS;
    switch (aType) {
      case 's_a': {
        path = ESTORE_SAVE_ADDRESS;
        break;
      }
      case 'b_a': {
        path = SAVE_BILLLING_ADDRESS;
        break;
      }
      case 'o_s_a': {
        path = SAVE_ORDER_ADDRESS;
        break;
      }
    }
    return template(path)({
      baseUrl: 'https://www.asovx.com.d/',
    });
  }

  // 回显表单
  fillForm = address => {
    // const { address, currency } = this.props;
    if (!address) return;
    const {
      id: addressId,
      country_code: country,
      province: sub_country,
      city,
      district: sub_city,
      zip_code: zip_or_postal_code,
      address: street1,
      address2: street2,
      receiver_name: full_name,
      receiver_phone: phone_number,
      receiver_email: email,
      document,
      cert_id,
    } = address;
    this.setState(
      buildValidAddressObject({
        addressId,
        fullname: full_name,
        street1,
        street2,
        city,
        subCountry: sub_country,
        country,
        postalCode: zip_or_postal_code,
        phoneNumber: phone_number,
        // orderNumber: order_number,
        aType: 'b_a',
        email,
        certId: cert_id,
        certType: document,
      })
    );
  };

  getSubmitData() {
    const {
      addressId,
      fullname,
      street1,
      street2,
      city,
      subCountry,
      country,
      postalCode,
      phoneNumber,
      orderNumber,
      aType,
      email,
      certId,
      certType,
    } = this.state;
    const submitData = {
      a_type: aType,
      address: {
        full_name: fullname,
        phone_number: phoneNumber,
        street1,
        street2,
        country,
        sub_country: subCountry,
        city,
        sub_city: '',
        zip_or_postal_code: postalCode,
        email,
        cert_id: country == 'TR' || country == 'ID' || country == 'QA' ? certId : '',
        document: country == 'ID' ? certType : '',
      },
    };

    switch (aType) {
      case 's_a':
      case 'b_a':
        submitData['address_id'] = addressId;
        break;
      case 'o_s_a':
        submitData['order_number'] = orderNumber;
        break;
    }
    return submitData;
  }

  submitAddress() {
    const submitData = this.getSubmitData();
    const submitPath = this.getSubmitPath();
    return new Promise((resolve, reject) => {
      resolve(submitData);
      // xhr.post(submitPath, submitData).then(result => {
      //   const { ret_code } = result;
      //   if (ret_code === 200000) {
      //     return resolve();
      //   } else if (ret_code === 403401) {
      //     //  订单不允许修改地址
      //     return reject();
      //   } else if (ret_code === 403402) {
      //     return reject();
      //   }
      //   return reject();
      // });
    });
  }

  render() {
    return (
      <div>
        <form className="add-address-form">{this.getRenderFormItems()}</form>
      </div>
    );
  }
}

export default ShippingNewAddress;
