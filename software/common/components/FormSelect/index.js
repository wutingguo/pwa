import React, { memo, useEffect, useState } from 'react';

import { XIcon } from '@common/components';

import { FInput } from '@src/components/PayFormInfo/paySection';
import XDropdown from '@src/components/PayFormInfo/paySection/XDropdown';

import './index.scss';

const SelectDown = props => {
  const {
    dropdownList,
    selectValue = '',
    onChange,
    labelName = 'label',
    valueName = 'value',
    renderLable,
    placeholder = '',
  } = props;
  const [selectCurrentLabel, setLabel] = useState('');
  useEffect(() => {
    // 根据选定的value值渲染下拉的选择项
    const findItem = (arr, value) => arr.find(item => item[valueName] === value) || {};
    if (selectValue) {
      setLabel(findItem(dropdownList, selectValue)[labelName]);
    } else {
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
  const defaultRenderLable = () => {
    return (
      <div className="dropdownBox">
        <FInput value={selectCurrentLabel} readOnly placeholder={placeholder} />
        <XIcon type="dropdown" />
      </div>
    );
  };
  return (
    <XDropdown
      clickOnly={true}
      dropdownList={cloneList}
      renderLable={renderLable || defaultRenderLable}
      selectedValue={selectValue}
      // label={selectCurrentLabel}
      arrow="center"
    />
  );
};
export default memo(SelectDown);
