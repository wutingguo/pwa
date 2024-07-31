import React, { memo } from 'react';


const PriceSection = ({ isSubProject, cartItem, currency, countryCode }) => {
  const { std_spu_info } = cartItem;
  const { total_unit_price, sale_price, total_discount, total_sale_price, unit_price } =
    std_spu_info || {};

  const { symbol } = currency;

  // let showMakerPrice = apply_maker_price && Number(maker_price) > 0;
  let showDiffPrice = sale_price && Number(unit_price) > Number(sale_price);
  let salePriceValue = showDiffPrice ? sale_price : unit_price;
  let prefixSymbol = '';
  if (isSubProject) {
    showDiffPrice = false;
    prefixSymbol = '+';
    // salePriceValue = addition_price && Number(addition_price) > 0 ? addition_price : '';
  }

  // let formatMakerPrice = `${symbol}${maker_price}`;
  let formatUnitPrice = `${symbol}${total_unit_price}`;
  let formatSalePriceValue = salePriceValue ? `${prefixSymbol}${symbol}${salePriceValue}` : null;
  // if (needFormatCurrencyCountryMap.includes(countryCode)) {
  //   formatMakerPrice = formatCurrency(maker_price);
  //   formatUnitPrice = formatCurrency(unit_price);
  //   formatSalePriceValue = salePriceValue
  //     ? `${prefixSymbol} ${formatCurrency(salePriceValue)}`
  //     : null;
  // }

  return (
    <div>
      {/* {showMakerPrice ? (
        <div className="maker-plan-price-container">
          <span className="project-item-price">{formatMakerPrice}</span>
          <div className="maker-plan-icon-container">
            <img className="maker-plan-icon" src={makerPlanIcon} />
            <div className="maker-plan-tip">{t('MAKER_PLAN_PRICE_TIP')}</div>
          </div>
        </div>
      ) : ( */}
      <div>
        {showDiffPrice && <div className="project-item-price origin">{formatUnitPrice}</div>}
        <div className="project-item-price">{formatSalePriceValue}</div>
      </div>
      {/* )} */}
    </div>
  );
};

export default memo(PriceSection);
