import cls from 'classnames';
import React, { memo } from 'react';

import './index.scss';

const Select = ({ className, style, value, options = [], onChange }) => {
  return (
    <select
      className={cls('zno-website-designer-page-select', className)}
      style={style}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(o => {
        const { label, value: optionValue } = o;
        return (
          <option key={optionValue} value={optionValue} selected={optionValue === value}>
            {label}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
