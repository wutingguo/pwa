import React, { memo, useContext, useMemo, useState } from 'react';

import { initalDefaultOption, textToPosition } from './config';
import { DefaultItem, DefaultLabel, DefaultLine, Space } from './layout';

const WatermarkPosition = props => {
  const { handleWaterMarkPositionChange, activeKey } = props;

  return (
    <div
      style={{
        width: 'fit-content',
        borderLeft: '1px solid #DCDCDC',
        borderTop: '1px solid #DCDCDC',
      }}
    >
      {initalDefaultOption.map(item => (
        <DefaultLine key={item.key}>
          {item.children.map((child, index) => {
            if (child.key === 'space') {
              return <Space key={index} width={0} />;
            }
            return (
              <DefaultItem key={index} type={child.key}>
                <DefaultLabel
                  active={activeKey === child.key}
                  style={activeKey === child.key ? { border: '1px solid #222222' } : {}}
                  onClick={() => handleWaterMarkPositionChange(child.key)}
                >
                  {''}
                </DefaultLabel>
              </DefaultItem>
            );
          })}
        </DefaultLine>
      ))}
    </div>
  );
};

export default memo(WatermarkPosition);
