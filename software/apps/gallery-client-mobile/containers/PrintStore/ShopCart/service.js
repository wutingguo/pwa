import {
  deleteCartItem,
  getCurrentCart,
  updateCartItemQuantity,
} from '@apps/gallery-client/services/cart';

import mocks from './mocks';

const fetchCartData = async ({ estoreBaseUrl }) => {
  const res = await getCurrentCart({ baseUrl: estoreBaseUrl });
  return res;
};

const composeCartData = async ({ estoreBaseUrl }) => {
  const data = await fetchCartData({
    estoreBaseUrl,
  });
  if (!data) {
    console.error('fetchCartData error', data);
    return null;
  }

  return {
    shipping: data.shipping,
    currency: data.currency,
    price: data.price,
    cart_items: data.cart_items || [],
    coupon: data.coupon,
  };
};

const removeCartItem = async ({ cartItemId, estoreBaseUrl }) => {
  try {
    const res = await deleteCartItem({ cartItemId, estoreBaseUrl });

    return res;
  } catch (e) {
    console.error(e);
  }
};

const changeCartItemQuantity = async ({ cartItemId, estoreBaseUrl, quantity }) => {
  try {
    const res = await updateCartItemQuantity({ cartItemId, estoreBaseUrl, quantity });

    return res;
  } catch (e) {
    console.error(e);
  }
};

const shopCartService = {
  composeCartData,
  removeCartItem,
  changeCartItemQuantity,
};

export default shopCartService;
