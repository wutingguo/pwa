import React, { useEffect, useState } from 'react';

import commonGenerator from '../../generateComp';

import config from './config';

import './index.scss';

const ProductInfo = props => {
  const { onChange, data, categoryOptions, ...etc } = props;

  return (
    <div className="productInfoWrapper commonSection">
      <div className="selectionTitle">商品信息</div>
      {commonGenerator(config, onChange, {
        ...data,
        etc,
        options: categoryOptions,
      })}
    </div>
  );
};

export default ProductInfo;
