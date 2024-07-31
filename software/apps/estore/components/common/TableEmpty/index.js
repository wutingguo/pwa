import React, { memo } from 'react';
import './index.scss';

const TableEmpty = ({ Options = null, text = '' }) => {
  return (
    <div className="store-table-empty">
      <div className="store-table-empty__options">{Options}</div>

      <span className="store-table-empty__desc">{text}</span>
    </div>
  );
};

export default memo(TableEmpty);
