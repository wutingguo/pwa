import cls from 'classnames';
import React, { memo } from 'react';

import './index.scss';

const prefixCls = 'zno-website-designer-page-tabs';

const Tabs = ({ tabs = [], activeKey, onChange }) => {
  return (
    <div className={prefixCls}>
      {tabs.map(tab => {
        const { key, label } = tab;
        const active = activeKey === key;
        return (
          <div
            key={key}
            className={cls(`${prefixCls}-item`, active && 'tab-active')}
            onClick={() => {
              key !== activeKey && onChange(key);
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default memo(Tabs);
