import classnames from 'classnames';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { XIcon } from '@common/components';

import useLogin from '../../hooks/useLogin';

import './index.scss';

const ShopCartButton = ({
  className,
  style = {},
  size = '',
  boundGlobalActions,
  boundProjectActions,
  getRedirectUrl,
}) => {
  const { urls, store } = useSelector(storeState => {
    return {
      urls: storeState.root.system.env.urls,
      store: storeState.store,
    };
  });

  const estoreBaseUrl = urls.get('estoreBaseUrl');

  const history = useHistory();

  const [state, setState] = useState({
    // nums: undefined
  });

  const { checkIsLoginByServer, showLoginModal } = useLogin({
    boundGlobalActions,
    boundProjectActions,
  });

  const set = useCallback((payload = {}) => {
    setState(v => ({ ...v, ...payload }));
  }, []);

  const handleClick = useCallback(async () => {
    window.logEvent.addPageEvent({
      name: 'ClientEstore_Click_Cart',
    });
    const isLogion = await checkIsLoginByServer();
    if (!isLogion) {
      showLoginModal({
        onLoginSuccess: () => {
          history.push('/printStore/shopping-cart');
        },
      });
    } else {
      history.push('/printStore/shopping-cart');
    }
  }, [checkIsLoginByServer, showLoginModal, state]);

  const fetchCartNums = useCallback(async () => {
    try {
      const number = await boundProjectActions.refetchShopCartState({ estoreBaseUrl });
      // set({ nums: Number(number) });
    } catch (e) {
      console.error(e);
    }
  }, [boundProjectActions, estoreBaseUrl]);

  useEffect(() => {
    fetchCartNums();
  }, [fetchCartNums]);

  // const { nums } = state;
  const shopCart = store.get('shopCart');
  const nums = shopCart ? store.getIn(['shopCart', 'nums']) : 0;

  const isFetchedNums = typeof nums === 'number';

  const clName = classnames('print-store-shopping-cart-button', className);
  const sizeSuffix = size ? `-${size}` : '';

  return (
    <span className={clName} style={style} onClick={handleClick}>
      <XIcon
        type={`shop-cart${sizeSuffix}`}
        className="shop-cart-icon-wrap"
        title=""
        iconWidth={32}
        iconHeight={32}
        // status={currentSetFavoriteImageCount !== 0 ? 'active' : ''}
      />
      {isFetchedNums && nums !== 0 && (
        <span className="print-store-shopping-cart-button__nums-dot">{nums}</span>
      )}
    </span>
  );
};

export default memo(ShopCartButton);
