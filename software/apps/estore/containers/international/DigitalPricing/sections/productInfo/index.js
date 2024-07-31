import React, { useEffect, useState } from 'react';
import tishi from '@apps/estore/components/static/tishi.png';
import './index.scss';

const ProductInfo = props => {
  const { onChange, data, categoryOptions } = props;
  const { product_name, product_description } = data;

  return (
    <div className="productInfoWrapper commonSection">
      <div className="selectionTitle">{product_name}</div>
      <div className="descWrapper">
        <div className="label">Product Description</div>
        <div className="desc">{product_description}</div>
      </div>
      <div className="tips">
        <img src={tishi} alt="提示" className="prompt" />
        If you want photo downloads to be available only through purchase in your store, you’ll also
        want to make sure Downloads are off in your collection’s settings — this is a separate
        feature from selling photo downloads in your store.
      </div>
    </div>
  );
};

export default ProductInfo;
