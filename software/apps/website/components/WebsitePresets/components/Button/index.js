import cls from 'classnames';
import React, { memo } from 'react';

import './index.scss';

const Button = ({ className, style, black, size = 'middle', children, onClick }) => {
  return (
    <button
      className={cls('zno-website-designer-page-button', className, `size-${size}`, { black })}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default memo(Button);
