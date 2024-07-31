import React, { memo } from 'react';
import classNames from 'classnames';
import { merge } from 'lodash';
import './index.scss';

const DragLine = props => {
  const { className, style, isShow, children } = props;

  const customClass = classNames('drag-line', className);
  const newStyle = merge({}, style, {
    display: isShow ? 'block' : 'none'
  });
  return (
    <div style={newStyle} className={customClass}>
      {children}
    </div>
  );
};

export default memo(DragLine);
