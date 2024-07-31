import React, { memo } from 'react';

import img from './empty.svg';

import './index.scss';

const Empty = ({ desc = 'No Data' }) => {
  return (
    <div className="website-presets-empty">
      <div className="website-presets-empty-content">
        <img src={img} />
        <div className="desc">{desc}</div>
      </div>
    </div>
  );
};

export default memo(Empty);
