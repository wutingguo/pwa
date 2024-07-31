import React, { memo, useMemo } from 'react';

const skuTransformer = sku => {
  const {
    can_change_qty,
    display_name,
    is_offline,
    item_checked,
    item_id,
    item_index,
    //产品类型：1: project 2: 标品sku
    item_target_type,
    min_qty,
    project_id,
    quantity,
    sale_price,
    total_price,
    total_discount,
    total_sale_price,
    total_unit_price,
    unit_price
  } = sku;

  return sku;
};

const SkuItems = ({
  isSubProject,
  currency,
  countryCode,
  cartItem,
  isPulled,
  noQuantity,
  hasRightQuantity = false
}) => {
  const { symbol } = currency || {};

  const combinedGroups = useMemo(() => {
    const { item_details = [] } = cartItem;

    const result = item_details.map(detail => {
      const { main_sku, add_on_sku = [] } = detail;
      let addonskuArr = add_on_sku ?? [];
      return [skuTransformer(main_sku), ...addonskuArr.map(s => skuTransformer(s))];
    });
    return result;
  }, [cartItem]);
  console.log('combinedGroups: ', combinedGroups);

  return (
    <div className="project-additional-items-container">
      {combinedGroups.map(group => {
        return group.map(sku => {
          const showPrice = sku['unit_price'];
          let formatShowPrice = isPulled ? '' : `${symbol}${showPrice}`;
          // if (needFormatCurrencyCountryMap.includes(countryCode)) {
          //   formatShowPrice = formatCurrency(showPrice);
          // }
          return (
            <div key={sku.item_id} className="project-additional-item">


              {/* 左侧产品 title, 描述, 添加项, 子产品描述 原*/}
              {/* <div className="project-additional-item-name">{adtItem['display_name']}</div> */}
              {/* 打标工艺等多个数量时 显示具体的数量（X2）  需要排除item为页数的情况 新 */}
              <div className="project-additional-item-name">
                {noQuantity
                  ? sku.display_name
                  : `
                      ${sku.display_name}
                      ${sku.quantity > 1 && sku.display_name.indexOf('page') === -1
                    ? __isCN__
                      ? ''
                      : `X${sku.quantity}`
                    : ''
                  }
                    `}
              </div>
              {/* 右侧价格、数量、总价 部分 */}
              <div className="right-section-price">
                <div className="right-section-item">{formatShowPrice}</div>
                <div className="right-section-item middle-item">
                  {hasRightQuantity && sku.quantity}
                </div>
                <div className="right-section-item"></div>
              </div>
            </div>
          );
        });
      })}
    </div>
  );
};

export default memo(SkuItems);
