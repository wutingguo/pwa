import React, { memo } from 'react';

const PriceSection = ({ isSubProject, cartItem, currency }) => {
  const { std_spu_info } = cartItem;
  const { total_unit_price, sale_price, unit_price, total_sale_price } = std_spu_info || {};

  const { symbol } = currency;

  let showDiffPrice = sale_price && Number(unit_price) > Number(sale_price);
  let salePriceValue = showDiffPrice ? total_sale_price : unit_price;
  let prefixSymbol = '';
  if (isSubProject) {
    showDiffPrice = false;
    prefixSymbol = '+';
  }

  let formatUnitPrice = `${symbol}${total_unit_price}`;
  let formatSalePriceValue = salePriceValue ? `${prefixSymbol}${symbol}${salePriceValue}` : null;

  return (
    <div>
      <div>
        {showDiffPrice && <div className="project-item-price origin">{formatUnitPrice}</div>}
        <div className="project-item-price">{formatSalePriceValue}</div>
      </div>
      {/* )} */}
    </div>
  );
};

export default memo(PriceSection);
