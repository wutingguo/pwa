import React, { useEffect } from 'react';
import PricingCollapse from '@apps/estore/components/pricingCollapse';
import collaspePng from '../../../Pricing/icons/CollaspeAll.png';
import './index.scss';

const ProductPricing = props => {
  const { collapseData, deep, optionStates, setExpandAll, expandAll } = props;

  const pricingTitleStyle = {
    // marginLeft: 273 + deep * 35
    marginLeft: deep * 32
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
        <div>Pricing</div>
        <div
          onClick={() => {
            if (!expandAll) {
              window.logEvent.addPageEvent({
                name: 'Estore_Products_CustomizeSPU_Click_ExpandAll',
              });
            } else {
              window.logEvent.addPageEvent({
                name: 'Estore_Products_CustomizeSPU_Click_CollaspeAll',
              });
            }
            setExpandAll(!expandAll);
          }}
          className="actionWrapper"
        >
          <img className={`${expandAll ? 'expanded' : ''}`} src={collaspePng} />
          {expandAll ? 'Collapse All' : 'Expand All'}
        </div>
      </div>
      <div className="pricingWrapper">
        <div className="pricing">
          {!isDefault && <div className="pricing-title">Variation</div>}
          <div style={pricingTitleStyle} className="self-pricing-title-container">
            <div style={isDefault ? { marginLeft: 0 } : {}} className="price text title">
              Price
            </div>
          </div>
        </div>
        <div className="grid">{collapseData}</div>
      </div>
    </div>
  );
};

export default ProductPricing;
