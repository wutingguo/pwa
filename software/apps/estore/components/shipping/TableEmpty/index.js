import React, { memo } from 'react';

import './index.scss';

const TableEmpty = ({ Options = null, text = '' }) => {
  return (
    <div className="store-shipping-table-empty">
      <div className="store-shipping-table-empty__options">{Options}</div>
      {!__isCN__ ? (
        <>
          <span className="store-shipping-table-empty__desc">
            Create shipping methods that will apply to all your Self Fulfillment price sheets.
          </span>
          <span className="store-shipping-table-empty__desc">
            You will need to create at least one shipping method for the country you'd like to sell
            to.
          </span>
        </>
      ) : (
        <div className="store-shipping-table-empty__desc">{t('STORE_SHIPPING_TITLE')}</div>
      )}
    </div>
  );
};

export default memo(TableEmpty);
