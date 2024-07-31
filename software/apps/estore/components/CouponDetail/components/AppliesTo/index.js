import React, { memo, useEffect, useMemo } from 'react';

import { XRadio } from '@common/components';

import './index.scss';

const AppliesTo = props => {
  const { name, value, defaultValue = 0, onChange, rackList, boundGlobalActions } = props;
  const selectValue = value || defaultValue;
  // useEffect(() => {
  //     onChange(selectValue);
  // }, [])
  const list = useMemo(() => {
    return [
      { text: 'All pricesheets', value: 0, disable: false },
      { text: 'Specific pricesheets', value: 1, disable: !rackList.length },
    ];
  }, [rackList]);
  const formChange = item => {
    if (item.value === 1 && !rackList.length) {
      boundGlobalActions.addNotification({
        message: 'No created pricesheets yet!',
        level: 'error',
        autoDismiss: 3,
      });
    }
  };
  return (
    <div className="AppliesTo">
      {list.map(item => (
        <div onClick={() => formChange(item)}>
          <XRadio
            key={item.value}
            onClicked={onChange}
            text={item.text}
            textClass="txt"
            skin="black-theme"
            value={item.value}
            checked={selectValue === item.value}
            name={name}
            disabled={item.disable}
          />
        </div>
      ))}
    </div>
  );
};

export default memo(AppliesTo);
