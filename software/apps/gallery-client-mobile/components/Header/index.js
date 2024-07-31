import classnames from 'classnames';
import qs from 'qs';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import backPng from '@resource/static/icons/handleIcon/back_1.png';

import ConsumerButton from '../ConsumerButton';
import ShopCartButton from '../ShopCartButton';

import './index.scss';

const Header = ({
  className,
  style = {},
  boundGlobalActions,
  boundProjectActions,
  store,
  options,
}) => {
  const { headerTitle, hideRightButton, backLink } = options;
  const [title, setTitle] = useState(headerTitle || t('PRINT_STORE'));
  const history = useHistory();
  const clName = classnames('print-store-header', className);
  const isShowPrintStore = Boolean(store.getIn(['fetched', 'status']) && store.get('status'));
  const { product_name } = qs.parse(location.hash.split('?')[1]) || {};
  useEffect(() => {
    if (product_name) {
      setTitle(product_name);
    } else {
      setTitle(headerTitle);
    }
  }, [product_name, headerTitle]);
  const handleGoBack = useCallback(() => {
    if (backLink) {
      history.push(backLink);
      return;
    }
    history.goBack();
  }, [backLink]);

  return (
    <div className={clName} style={style}>
      <div className="print-store-header__back" onClick={handleGoBack}>
        <img src={backPng} />
      </div>
      <div className="print-store-header__bar-item title">{title}</div>
      {!hideRightButton && (
        <div className="print-store-header__bar-item buttons">
          <ShopCartButton
            boundGlobalActions={boundGlobalActions}
            boundProjectActions={boundProjectActions}
          />
          <ConsumerButton
            size="big"
            boundGlobalActions={boundGlobalActions}
            boundProjectActions={boundProjectActions}
            isShowPrintStore={isShowPrintStore}
          />
        </div>
      )}
    </div>
  );
};

export default memo(Header);
