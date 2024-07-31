import React from 'react';
import classnames from 'classnames';
import XSelect from '@resource/components/XSelect';
import { getLanguageCode } from '@resource/lib/utils/language';
import { formItemNames, getFormItemOptions } from './formItemConfig';
import { getFormItemOrder } from './formItemOrder';

import warnIcon from '@common/icons/warn.svg';

const inputOnlyKeys = [
  formItemNames.fullname,
  formItemNames.street1,
  formItemNames.street2,
  formItemNames.city,
  formItemNames.postalCode,
  formItemNames.phoneNumber,
  formItemNames.email,
  formItemNames.certId
];

const groupDataList = dataList => {
  let newDataList = [];
  const groupNames = [];
  const groupNameItems = {};
  dataList.forEach(item => {
    const groupName = item['group_name'];
    if (groupNames.find(gn => gn['group_name'] === groupName)) {
      groupNameItems[groupName].push(item);
    } else {
      groupNames.push({
        group_name: groupName,
        short_code: item['group_code'],
        local_name: `-- ${groupName} --`,
        disabled: true
      });
      groupNameItems[groupName] = [item];
    }
  });
  groupNames.forEach((gnItem, index) => {
    if (index) {
      newDataList.push({
        group_name: '  ',
        short_code: '  ',
        local_name: '  ',
        disabled: true
      });
    }
    newDataList.push(gnItem);
    newDataList = newDataList.concat(groupNameItems[gnItem['group_name']]);
  });
  return newDataList;
};

const formatSelectData = dataList => {
  let newDataList = dataList;
  if (dataList[0] && dataList[0]['group_code']) {
    newDataList = groupDataList(dataList);
  }
  const selectData = [];
  newDataList.forEach(item => {
    selectData.push({
      value: item['short_code'],
      label: item['local_name'],
      disabled: item['disabled']
    });
  });
  return selectData;
};

export const getRenderValue = (that, itemKey, itemOption) => {
  const { country, fullDistricts } = that.state;
  const selectedDistrict = fullDistricts.find(dist => dist['short_code'] === country) || [];
  const subDistricts = selectedDistrict['sub_districts'] || [];
  const renderInput =
    inputOnlyKeys.includes(itemKey) ||
    (itemKey === formItemNames.subCountry && !subDistricts.length);
  const certTypeList = [
    {
      label: 'Identification Number',
      value: 'IDENTIFICATION_NUMBER'
    },
    {
      label: 'Passport Number',
      value: 'PASSPORT_NUMBER'
    },
    {
      label: 'NPWP',
      value: 'NPWP'
    }
  ];
  if (renderInput) {
    const { inputProps = {} } = itemOption;
    return (
      <input
        className="text-field"
        value={that.state[itemKey]}
        onFocus={that.onInputFocus.bind(that, itemKey)}
        onChange={that.onInputChange.bind(that, itemKey)}
        onBlur={that.validateItem.bind(that, itemKey, itemOption)}
        {...inputProps}
      />
    );
  }
  const itemData = itemKey === formItemNames.country ? fullDistricts : subDistricts;
  const formatedData = formatSelectData(itemData);

  // const dataSoruce = itemKey === formItemNames.country ? formatedData : certTypeList;
  const xSelectKeys = [formItemNames.country, formItemNames.subCountry];
  const dataSoruce = xSelectKeys.includes(itemKey) ? formatedData : certTypeList;

  return (
    <XSelect
      value={that.state[itemKey]}
      options={dataSoruce}
      disabled={that.state[`${itemKey}Disabled`]}
      onChanged={that.onSelectChange.bind(that, itemKey)}
    />
  );
};

export const getRenderFormItems = that => {
  const { focusKey, formItemOrder, languageCode, country } = that.state;
  let addressItems = getFormItemOrder(languageCode, country);
  const renderFormItems = [];
  addressItems.forEach(itemKey => {
    const formItemOptions = getFormItemOptions(languageCode, country);
    const itemOption = formItemOptions[itemKey];
    if (itemOption) {
      const { label, required, defaultTip } = itemOption;
      const itemWarnTip = that.state[`${itemKey}Tip`];
      const itemTaxTip = that.state[`${itemKey}TaxTip`];
      const formItemCls = classnames('form-item', {
        'form-item-de-tr':
          getLanguageCode() === 'de' ||
          country === 'DE' ||
          country === 'TR' ||
          country === 'ID' ||
          country === 'QA'
      });
      renderFormItems.push(
        <div key={itemKey} className={formItemCls}>
          <label>
            {label}
            {required && <sup>*</sup>}
          </label>
          <div className="text-field-container">
            {getRenderValue(that, itemKey, itemOption)}
            {itemWarnTip && <img className="warning-icon" src={warnIcon} />}
            {focusKey === itemKey && (itemWarnTip || defaultTip) && (
              <p className="warning-text">{itemWarnTip || defaultTip}</p>
            )}
            {itemTaxTip && <p className="tax-tip-text">{itemTaxTip}</p>}
          </div>
        </div>
      );
    }
  });
  return renderFormItems;
};
