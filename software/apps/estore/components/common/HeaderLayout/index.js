import React, { memo } from 'react';
import './index.scss';

/**
 *
 * @param {Object} props {title: string, Title: ReactNode, options: ReactNode}
 * @returns
 */
const HeaderLayout = ({ title = '', Title = null, Options = null }) => {
  return (
    <div className="store-common-header">
      <div className="store-common-header__title">{Title || title}</div>

      <div className="store-common-header__options">{Options}</div>
    </div>
  );
};

export default memo(HeaderLayout);
