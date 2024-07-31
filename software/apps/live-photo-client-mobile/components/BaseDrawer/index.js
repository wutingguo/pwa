import cls from 'classnames';
import React from 'react';

import './index.scss';

export default function BaseDrawer(props) {
  const { children, open, maskClick, style, contentStyle } = props;

  return (
    <div
      className={cls('base_drawer', {
        hidden: !open,
      })}
      style={style}
    >
      <div className={cls('base_drawer_mask')} onClick={maskClick}></div>
      <div className={cls('base_drawer_content')} style={contentStyle}>
        {children}
      </div>
    </div>
  );
}
