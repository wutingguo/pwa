import React, { memo } from 'react';
import classNames from 'classnames';
import XSelect from '@resource/components/XSelectV1';
import './index.scss';

/**
 * 对共用select的样式覆盖 与UI一致
 */
const Select = ({ className, width = '100%', style = {}, controllerStyle = {}, ...rest }) => {
  const containerClassName = classNames('pwa-select-container', className);
  return (
    <div className={containerClassName} style={{ width, ...style }}>
      <XSelect className="pwa-select" style={{ ...controllerStyle }} {...rest} />
    </div>
  );
};

export default memo(Select);
