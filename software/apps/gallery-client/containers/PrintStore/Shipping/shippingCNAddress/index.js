import React, { Component } from 'react';

import Cascader from '@common/components/CascaderNew';
import XLoading from '@common/components/XLoading';

import warnIcon from '@common/icons/warn.svg';

import * as renderHelp from './_handle';
import { getFormItemOptions } from './handler/formItemConfig';
import { getFormItemOrder } from './handler/formItemOrder';

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

export default class AddressComp extends Component {
  constructor(props) {
    super(props);
    const { address_id, order_number } = props;
    this.state = {
      country: 'CN',
      sub_country: '',
      city: '',
      sub_city: '',
      town: '',
      street1: '',
      streets: [],
      street2: '',
      full_name: '',
      phone_number: '',
      zip_or_postal_code: '',
      a_type: order_number ? 'o_s_a' : 's_a',
      address_id,
      order_number,
      isShowLoading: false,
      warnText: '',
    };
    this.didMount = () => renderHelp.didMount(this);
    this.onCreate = () => renderHelp.onCreate(this);

    this.handleChange = e => renderHelp.handleChange(this, e);
    this.getAddressDetailData = () => renderHelp.getAddressDetailData(this);
    this.onTagClick = e => renderHelp.onTagClick(this, e);
    this.validatorFunc = () => renderHelp.validatorFunc(this);
    this.handleSelectAddress = address => renderHelp.handleSelectAddress(this, address);
  }

  componentDidMount() {
    this.didMount();
  }

  validateItem = (itemKey, itemOption) => {
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
  };

  checkAllItemValue = () => {
    const { country } = this.state;
    const formItemOrder = getFormItemOrder('cn', country);
    const formItemOptions = getFormItemOptions('cn', country);
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
  };

  // 回显表单
  fillForm = address => {
    console.log('address: +++++++++++++', address);
    // const { address, currency } = this.props;
    if (!address) return;
    const {
      id: address_id,
      country_code: country,
      province: sub_country,
      city,
      street,
      district: sub_city,
      zip_code: zip_or_postal_code,
      address: street1,
      address2: street2,
      receiver_name: full_name,
      receiver_phone: phone_number,
    } = address;

    const outState = buildValidAddressObject({
      address_id,
      full_name,
      street1,
      street2,
      city,
      sub_city,
      sub_country,
      country,
      zip_or_postal_code,
      phone_number,
      town: street,
      // orderNumber: order_number,
      a_type: 'b_a',
    });
    console.log('outState:************ ', outState);
    this.setState({
      ...outState,
    });
  };

  getSubmitData = () => {
    const {
      address_id,
      full_name,
      street1,
      street2,
      city,
      sub_country,
      country,
      sub_city,
      postalCode,
      phone_number,
      order_number,
      a_type,
      email,
      certId,
      certType,
      zip_or_postal_code,
      town,
      province_code,
    } = this.state;
    const submitData = {
      a_type,
      address: {
        full_name,
        phone_number,
        street1,
        street2,
        country,
        sub_country,
        city,
        sub_city,
        zip_or_postal_code,
        email,
        town,
        cert_id: country == 'TR' || country == 'ID' || country == 'QA' ? certId : '',
        document: country == 'ID' ? certType : '',
        province_code,
      },
    };

    switch (a_type) {
      case 's_a':
      case 'b_a':
        submitData['address_id'] = address_id;
        break;
      case 'o_s_a':
        submitData['order_number'] = order_number;
        break;
    }
    return submitData;
  };

  submitAddress = () => {
    const submitData = this.getSubmitData();
    return new Promise((resolve, reject) => {
      resolve(submitData);
    });
  };

  render() {
    const { estoreBaseUrl } = this.props;
    const {
      sub_country,
      sub_city,
      town,
      city,
      street1,
      full_name,
      phone_number,
      zip_or_postal_code,
      full_nameTip,
      phone_numberTip,
      street1Tip,
      sub_cityTip,
      sub_countryTip,
      cityTip,
      townTip,
    } = this.state;

    const casaderProps = {
      estoreBaseUrl,
      selectComplete: this.handleSelectAddress,
      placeholder: '所属地区：省/市/区（必填）',
      isSupportStreet: true,
      province: sub_country,
      city: city,
      area: sub_city,
      street: town,
      name: 'address',
      needMapStateToProps: true,
    };

    return (
      <div className="shippingCNAddressWrapper">
        <form ref={node => (this.form = node)} className="form">
          <div className="field">
            <div className="label">
              <span className="color-red">*</span>所在地区:
            </div>
            <div className="input">
              <Cascader {...casaderProps} />
            </div>
            {(sub_cityTip || sub_countryTip || cityTip || townTip) && (
              <img className="warning-icon" src={warnIcon} />
            )}
          </div>
          <div className="field detaile-address">
            <div className="label">
              <span className="color-red">*</span>详细地区:
            </div>
            <div className="input">
              <textarea name="street1" value={street1} onChange={this.handleChange} />
            </div>
            {street1Tip && <img className="warning-icon" src={warnIcon} />}
          </div>
          <div className="input-container-wrapper">
            <div className="field accept">
              <div className="label">
                <span className="color-red">*</span>收货人:
              </div>
              <div className="input">
                <input
                  type="text"
                  name="full_name"
                  value={full_name}
                  onChange={this.handleChange}
                />
              </div>
              {full_nameTip && <img className="warning-icon" src={warnIcon} />}
            </div>
            <div className="field phone">
              <div className="label">
                <span className="color-red">*</span>手机号码:
              </div>
              <div className="input">
                <input
                  type="text"
                  name="phone_number"
                  value={phone_number}
                  onChange={this.handleChange}
                />
              </div>
              {phone_numberTip && <img className="warning-icon" src={warnIcon} />}
            </div>
          </div>
          <div className="field postalCode">
            <div className="label">邮政编码:</div>
            <div className="input">
              <input
                type="text"
                name="zip_or_postal_code"
                value={zip_or_postal_code}
                onChange={this.handleChange}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
