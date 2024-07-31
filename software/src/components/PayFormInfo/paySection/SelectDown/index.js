import React, { memo, useEffect, useState } from 'react';

import { XIcon } from '@common/components';

import XDropdown from '../XDropdown';
import { FInput } from '../index';

import './index.scss';

const SelectDown = props => {
  const {
    dropdownList,
    defaultSelect = {},
    selectValue = '',
    onChange,
    labelName = 'label',
    valueName = 'value',
    renderLable,
    placeholder = '',
  } = props;
  const [selectCurrentValue, setSelectValue] = useState(defaultSelect[valueName] || '');
  const [selectCurrentLabel, setLabel] = useState(defaultSelect[labelName] || '');

  useEffect(() => {
    // 根据选定的value值渲染下拉的选择项
    const findItem = (arr, value) => arr.find(item => item[valueName] === value) || {};
    if (selectValue) {
      setSelectValue(findItem(dropdownList, selectValue)[valueName]);
      onChange(selectValue);
      setLabel(findItem(dropdownList, selectValue)[labelName]);
    } else {
      setSelectValue('');
      setLabel('');
    }
  }, [selectValue, dropdownList]);
  const cloneList = dropdownList.map(item => {
    return {
      ...item,
      action: item => {
        onChange(item[valueName]);
        // setSelectValue(item[valueName]);
        // setLabel(item[labelName])
      },
    };
  });
  const defaultRenderLable = (label, selectedValue) => {
    return (
      <div className="dropdownBox">
        <FInput value={label} readOnly placeholder={placeholder} />
        <XIcon type="dropdown" />
      </div>
    );
  };
  return (
    <XDropdown
      clickOnly={true}
      dropdownList={cloneList}
      renderLable={renderLable || defaultRenderLable}
      selectedValue={selectCurrentValue}
      label={selectCurrentLabel}
      arrow="center"
    />
  );
};
export default memo(SelectDown);
