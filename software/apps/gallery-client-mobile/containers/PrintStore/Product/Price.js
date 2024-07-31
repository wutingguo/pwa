import classnames from 'classnames';
import React from 'react';

import { formatCurrency, getCountryCode, getCurrencyCode } from '@resource/lib/utils/currency';

const Price = ({ currencySymbol, price = 0, precision, currency_code }) => {
  const initPrice = Number(price);
  const currencyCode = currency_code || getCurrencyCode();
  const decimal = initPrice.toFixed(precision).split('.')[1];
  const isGermany = getCountryCode() === 'DE';
  let formatPrice = formatCurrency(initPrice);
  if (formatPrice + '') {
    formatPrice = formatPrice.split(',')[0];
  }
  let precisionNum = precision > 0 ? `${decimal}` : '';
  if (precisionNum) {
    precisionNum = isGermany ? `,${precisionNum} ` : `.${precisionNum}`;
  }
  const currencyCodeNode = !__isCN__ && (
    <span className="calculator-currency-code">{currencyCode}</span>
  );
  return (
    <div>
      {isGermany ? ( // 德国货币特殊处理
        <div className="price-num-wrap">
          <span className="price-num">{formatPrice}</span>
          {precisionNum}
          <span className="price-num">{currencySymbol}</span>
          &nbsp;{currencyCodeNode}
        </div>
      ) : (
        <div className="price-num-wrap">
          <span className="price-num">
            {currencySymbol || '$'}
            {parseInt(initPrice)}
          </span>
          {precisionNum}
          &nbsp;{currencyCodeNode}
        </div>
      )}
    </div>
  );
};
export default Price;
