// 由原代码迁移而来 不过与现在数据结构完全不同 留着作为参照 此处改用SkuItems
import React, { memo, useMemo } from 'react';

const AdditionalItems = ({ isSubProject, currency, countryCode, cartItem, isCombType }) => {
  const { symbol } = currency || {};
  const shouldShowQuantity = isCombType;
  const combinedItems = useMemo(() => {
    const {
      primary_item = [],
      addition_items = [],
      child_items = [],
      virtual_type = []
    } = cartItem;

    let items = [];
    // 产品类型  0 普通， 1 套系， 2 组合
    switch (virtual_type) {
      case 0: {
        items = isSubProject ? addition_items : [primary_item, ...addition_items];
        break;
      }
      case 2: {
        items = child_items;
        break;
      }
      case 1:
      default: {
        break;
      }
    }
    // debugger
    console.log('project-additional-items-container');
    return items;
  }, [cartItem, isSubProject]);
  // 因为添加了多页是按照一个 item 展示的，但是单价和总价都无法精确计算，所以在书的子项中加了 view_price 字段做特殊处理

  return (
    <div className="project-additional-items-container">
      {combinedItems.map(adtItem => {
        const showPrice = adtItem['view_price'] || adtItem['unit_price'];
        let formatShowPrice = `${symbol}${showPrice}`;
        return (
          <div key={adtItem.item_id} className="project-additional-item">
            {/* 右侧价格、数量、总价 部分 */}
            <div className="right-section">
              <div className="right-section-item">{formatShowPrice}</div>
              <div className="right-section-item middle-item">
                {shouldShowQuantity && adtItem['quantity']}
              </div>
              <div className="right-section-item"></div>
            </div>

            {/* 左侧产品 title, 描述, 添加项, 子产品描述 原*/}
            {/* <div className="project-additional-item-name">{adtItem['display_name']}</div> */}
            {/* 打标工艺等多个数量时 显示具体的数量（X2）  需要排除item为页数的情况 新 */}
            <div className="project-additional-item-name">
              {`
                  ${adtItem.display_name}
                  ${
                    adtItem.quantity > 1 && adtItem.display_name.indexOf('page') === -1
                      ? `X${adtItem.quantity}`
                      : ''
                  }
                `}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(AdditionalItems);
