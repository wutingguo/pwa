import React, { memo, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import XLoading from '@resource/components/XLoading';

import { formatCurrency, needFormatCurrencyCountryMap } from '@resource/lib/utils/currency';

import ApplyCoupon from '@common/components/ApplyCoupon';

import { XButton } from '@common/components';

import ButtonWithLoginCheck from '../../../components/ButtonWithLoginCheck';
import ShoppingCartItem from '../../../components/ShoppingCartItem';
import BreadCrumb from '../../../components/breadCrumb';
import useLogin, { withLoginCheck } from '../../../hooks/useLogin';

import EmptyShoppingCart from './Empty';
import Price from './Price';
import useCart from './hooks/useCart';
import shopCartService from './service';

import './index.scss';

const ShopCart = ({ boundGlobalActions, boundProjectActions, urls, refreshCart }) => {
  const history = useHistory();
  const estoreBaseUrl = urls.get('estoreBaseUrl');

  const { checkIsLoginByServer, showLoginModal } = useLogin({
    boundGlobalActions,
    boundProjectActions,
  });

  const {
    cartData,
    loading,
    isPaymentAlreadySetup,
    initCartData,
    refreshCartDataNoLoading,
    removeCartItem,
    changeCartItemQuantity,
    countryCode,
  } = useCart();

  const { cart_items = [], currency = null, price = null, coupon = null } = cartData || {};
  const { symbol, code } = currency || {};
  const { item_discount = 0 } = price || {};
  let formatCouponCount = `${symbol}${item_discount}`;
  if (needFormatCurrencyCountryMap.includes(code)) {
    formatCouponCount = formatCurrency(item_discount);
  }

  // 禁止继续前往shipping
  const shippingDisabled = useMemo(() => {
    return !isPaymentAlreadySetup || cart_items.some(i => !!i.disabled);
  }, [cart_items, isPaymentAlreadySetup]);

  const handleClickToShipping = useCallback(async () => {
    if (shippingDisabled) return;
    const isLogion = await checkIsLoginByServer();
    const { coupon } = await shopCartService.composeCartData({ estoreBaseUrl });
    if (coupon && !__isCN__) {
      const { valid, valid_code, minimum_amount } = coupon;
      if (!valid) {
        let errMsg = '';
        if (valid_code === 500864) {
          errMsg = "The coupon code doesn't exist or is invalid.";
        } else if (valid_code === 500865) {
          errMsg = 'The coupon code is expired.';
        } else if (valid_code === 500866) {
          errMsg = 'The coupon code is scheduled, not yet active.';
        } else if (valid_code === 500867) {
          const { symbol = '' } = currency || {};
          errMsg = `The coupon code requires minimum order amount of ${symbol}${minimum_amount}`;
        } else if (valid_code === 500868) {
          errMsg = 'The coupon code is not applicable to any items in the cart.';
        }
        boundGlobalActions.showConfirm({
          close: boundGlobalActions.hideConfirm,
          message: errMsg,
          buttons: [
            {
              text: 'OK',
              onClick: () => {
                location.reload();
              },
            },
          ],
        });
        return;
      }
    }
    if (!isLogion) {
      showLoginModal({
        onLoginSuccess: () => {
          history.push('/printStore/shopping-cart/shipping');
        },
      });
    } else {
      history.push('/printStore/shopping-cart/shipping');
    }
  }, [shippingDisabled, checkIsLoginByServer, showLoginModal, history]);

  const handleRefetchCartItems = useCallback(() => {
    boundProjectActions.refetchShopCartState({ estoreBaseUrl });
  }, [boundProjectActions, estoreBaseUrl]);

  if (!cart_items.length || loading.get('init')) {
    return (
      <div className="print-store-page-content-shop-cart--empty">
        <XLoading isShown={loading.get('init')} isCalculate={true} size="lg" />
        <EmptyShoppingCart />
      </div>
    );
  }

  return (
    <div className="print-store-page-content-shop-cart">
      <div className="shopping-cart-list" style={{ height: window.innerHeight - 280 }}>
        {cart_items.map(cartItem => {
          return (
            <ShoppingCartItem
              key={cartItem.item_id}
              cartItem={cartItem}
              currency={currency}
              countryCode={currency?.code}
              refreshPageData={initCartData}
              removeCartItem={removeCartItem}
              changeCartItemQuantity={changeCartItemQuantity}
              volumeDiscountProducts={[]}
              boundGlobalActions={boundGlobalActions}
              boundProjectActions={boundProjectActions}
              refetchCartNums={handleRefetchCartItems}
            />
          );
        })}
      </div>
      <div className="shopcart-bottom-container">
        {!__isCN__ && (
          <div className={`coupon_wrapper ${!isPaymentAlreadySetup ? 'with_tip' : ''}`}>
            <div className="price_left">
              <ApplyCoupon
                baseUrl={estoreBaseUrl}
                refreshCart={refreshCartDataNoLoading}
                coupon={coupon}
                isMobile={true}
              />
            </div>
            <div className="price_right">-{formatCouponCount}</div>
          </div>
        )}
        <div className="shopcart-price-addbtn">
          <Price
            price={price}
            currency={currency}
            countryCode={currency?.code}
            refreshPageData={initCartData}
            additionalData={{}}
            isCheckout={false}
          />
          <div className="checkout-button-container">
            <ButtonWithLoginCheck
              boundGlobalActions={boundGlobalActions}
              boundProjectActions={boundProjectActions}
              onClick={handleClickToShipping}
              className="black to-shipping-button"
              width="390"
              height="88"
              disabled={shippingDisabled}
            >
              {t('CONTINUE_TO_SHIPPING')} &gt;
            </ButtonWithLoginCheck>
          </div>
        </div>
        {!isPaymentAlreadySetup && (
          <div className="message-container">
            <span className="check-out-disabled-message">
              {`${t(
                'WARNING_TIPS1',
                `*The payment hasn't been setup. Please contact the photographer.`
              )}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ShopCart);
