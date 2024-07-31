import React, { useEffect } from 'react';

import PricingCollapse from '@apps/estore/components/pricingCollapse';

import collaspePng from '../../../Pricing/icons/CollaspeAll.png';

import './index.scss';

const ProductPricing = props => {
  const { collapseData, deep, optionStates, setExpandAll, expandAll } = props;

  const pricingTitleStyle = {
    // marginLeft: 273 + deep * 35
    marginLeft: deep * 32,
  };
  if (optionStates.length === 1) {
    pricingTitleStyle.marginLeft = 38;
  } else if (optionStates.length > 5) {
    pricingTitleStyle.marginLeft = (deep - 1) * 36;
  }

  const isDefault = !optionStates.length;

  if (isDefault) {
    pricingTitleStyle.marginLeft = 0;
  }

  return (
    <div className="productPricingWrapper commonSection">
      <div className="selectionTitle">
        <div>定价</div>
        <div
          onClick={() => {
            setExpandAll(!expandAll);
            window.logEvent.addPageEvent({
              name: expandAll
                ? 'Estore_Products_CustomizeSPU_Click_CollaspeAll'
                : 'Estore_Products_CustomizeSPU_Click_ExpandAll',
            });
          }}
          className="actionWrapper"
        >
          <img className={`${expandAll ? 'expanded' : ''}`} src={collaspePng} />
          {expandAll ? '收起' : ' 展开'}
        </div>
      </div>
      <div className="pricingWrapper">
        <div className="pricing">
          {!isDefault && <div className="pricing-title">商品明细</div>}
          <div style={pricingTitleStyle} className="self-pricing-title-container">
            <div style={isDefault ? { marginLeft: 0 } : {}} className="price text title">
              {!optionStates.length ? '商品售价' : '售价'}
            </div>
            <div className="shipping text title">附加运费</div>
            {!isDefault && <div className="visibility text title">是否隐藏</div>}
          </div>
        </div>
        <div className="grid">{collapseData}</div>
      </div>
    </div>
  );
};

export default ProductPricing;
