import { fromJS } from 'immutable';
import { useCallback, useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';

import { getStoreById } from '@apps/gallery-client/services/store';

import shopCartService from '../service';

const useCart = () => {
  const { urls, user, storeId } = useSelector(storeState => {
    return {
      urls: storeState.root.system.env.urls,
      user: storeState.store.get('user'),
      storeId: storeState.store.get('id'),
    };
  });

  const estoreBaseUrl = urls && urls.get('estoreBaseUrl');
  const saasBaseUrl = urls && urls.get('saasBaseUrl');

  const [immutableCartState, dispatch] = useReducer(
    (state, { type, payload, name }) => {
      switch (type) {
        case 'set':
          return state.merge(payload);
        case 'loading':
          const bool = !!payload;
          return state.mergeDeep({
            loading: {
              [name]: bool,
            },
          });

        default:
          throw new Error();
      }
    },
    fromJS({
      cartData: null,
      // b端是否设置好了paypal
      isPaymentAlreadySetup: true,
      loading: {
        init: false,
      },
    })
  );

  const set = useCallback(
    payload => {
      dispatch({
        type: 'set',
        payload,
      });
    },
    [dispatch]
  );

  const updateCartData = useCallback(
    data => {
      if (!data) return;
      dispatch({
        type: 'set',
        payload: { cartData: data },
      });
    },
    [dispatch]
  );

  const triggerLoading = useCallback(
    (name, bool) => {
      dispatch({
        type: 'loading',
        name,
        payload: bool,
      });
    },
    [dispatch]
  );

  // 刷新购物车数据
  const refreshCartDataNoLoading = useCallback(async () => {
    const data = await shopCartService.composeCartData({ estoreBaseUrl });
    updateCartData(data);
  }, [updateCartData, estoreBaseUrl]);

  const checkPayment = useCallback(async () => {
    // 获取b端商店的支付信息
    if (!storeId) return;
    const storeInfo = await getStoreById({ baseUrl: estoreBaseUrl, storeId });
    if (!storeInfo) return;
    const { payment_methods = [] } = storeInfo;
    const isPaymentAlreadySetup = payment_methods.some(m =>
      ['PAYPAL', 'OFFLINE', 'STRIPE'].includes(m.payment_method)
    );
    if (!isPaymentAlreadySetup) {
      // b端未设置paypal 切换为checkout disabled状态
      set({
        isPaymentAlreadySetup: false,
      });
    }
  }, [storeId, set]);

  const init = useCallback(async () => {
    triggerLoading('init', true);
    await refreshCartDataNoLoading();
    await checkPayment();
    triggerLoading('init', false);
  }, [estoreBaseUrl, refreshCartDataNoLoading, checkPayment]);

  const removeCartItem = useCallback(
    async cartItemId => {
      await shopCartService.removeCartItem({
        estoreBaseUrl,
        cartItemId,
      });
      await refreshCartDataNoLoading();
    },
    [refreshCartDataNoLoading, estoreBaseUrl]
  );

  const changeCartItemQuantity = useCallback(
    async ({ cartItemId, quantity }) => {
      await shopCartService.changeCartItemQuantity({
        estoreBaseUrl,
        cartItemId,
        quantity,
      });
      await refreshCartDataNoLoading();
    },
    [estoreBaseUrl]
  );

  useEffect(() => {
    init();
  }, [init, user]);

  return {
    cartData: immutableCartState.get('cartData'),
    loading: immutableCartState.get('loading'),
    isPaymentAlreadySetup: immutableCartState.get('isPaymentAlreadySetup'),
    initCartData: init,
    refreshCartDataNoLoading,
    removeCartItem,
    changeCartItemQuantity,
  };
};

export default useCart;
