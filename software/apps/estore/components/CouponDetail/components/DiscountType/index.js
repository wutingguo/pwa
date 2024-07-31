import React, { memo, useEffect, useMemo } from 'react';
import { useState } from 'react';

import { XIcon } from '@common/components';

import './index.scss';

const DiscountType = props => {
  const { onChange, defaultValue } = props;
  const [currentIndex, setCurrentIndex] = useState(defaultValue);
  const viewList = useMemo(() => {
    return [
      {
        id: 'Percent Off',
        symbolIcon: '%',
        txt: 'Percent Off',
      },
    ];
  }, []);
  // useEffect(() => {
  //   // onChange(defaultValue)
  // }, [])
  const onSelect = index => {
    setCurrentIndex(index);
    onChange(viewList[index]['id']);
  };
  return (
    <div className="DiscountType">
      {viewList.map((item, index) => (
        <div key={index} className="typeList">
          {currentIndex === index && (
            <XIcon
              type="radio"
              status="active"
              className="checkIcon"
              onClick={() => onSelect(index)}
            />
          )}
          <div className="symbol">{item.symbolIcon}</div>
          <div className="txt">{item.txt}</div>
        </div>
      ))}
    </div>
  );
};

export default memo(DiscountType);
