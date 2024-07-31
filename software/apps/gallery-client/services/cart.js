import * as xhr from 'appsCommon/utils/xhr';
import { template } from 'lodash';

import {
  ESTORE_AUTOMATIC,
  ESTORE_CREATE_ORDER,
  ESTORE_DELETE_CART_ITEM,
  ESTORE_GET_CART_NUM,
  ESTORE_GET_CURRENT_CART,
  ESTORE_GET_ORDER_DETAIL,
  ESTORE_PAYMENT_PREPARE,
  ESTORE_SAVE_ADDRESS,
  ESTORE_SAVE_SHIP_METHOD,
  ESTORE_UPDATE_CART_ITEM_QUANTITY,
} from '@resource/lib/constants/apiUrl';

// const baseUrl =
//   location.host.indexOf('asovx') > 0
//     ? `https://${location.host.replace('webproofing', 'www')}/`
//     : window.origin.replace('share', 'www') + '/';

export const getCurrentCart = ({ baseUrl }) => {
  return new Promise((resolve, reject) => {
    const url = template(ESTORE_GET_CURRENT_CART)({ baseUrl });
    xhr.get(url).then(result => {
      const { ret_code, data = {} } = result;
      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject;
      }
    });
  });
};

export const getOrderDetail = ({ baseUrl, order_no }) => {
  return new Promise((resolve, reject) => {
    const url = template(ESTORE_GET_ORDER_DETAIL)({ baseUrl, order_no });
    xhr.get(url).then(result => {
      const { ret_code, data = {} } = result;
      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject(ret_code);
      }
    });
  });
};

export const deleteCartItem = ({ cartItemId, estoreBaseUrl }) => {
  return new Promise((resolve, reject) => {
    const url = template(ESTORE_DELETE_CART_ITEM)({ baseUrl: estoreBaseUrl });
    xhr.post(url, { cart_item_id: cartItemId }).then(result => {
      const { ret_code, data = {} } = result;
      console.log(ret_code === 200000, 'ret_code:*********** ', ret_code);
      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject(ret_code);
      }
    });
  });
};

export const updateCartItemQuantity = ({ cartItemId, estoreBaseUrl, quantity }) => {
  return new Promise((resolve, reject) => {
    const url = template(ESTORE_UPDATE_CART_ITEM_QUANTITY)({ baseUrl: estoreBaseUrl });
    console.log('url:************* ', url);
    xhr.post(url, { cart_item_id: cartItemId, quantity: Number(quantity) }).then(result => {
      const { ret_code, data = {} } = result;
      console.log(ret_code === 200000, 'ret_code:*********** ', ret_code);
      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject(ret_code);
      }
    });
  });
};

export const getAutomatic = ({ baseUrl }) => {
  return new Promise((resolve, reject) => {
    const url = template(ESTORE_AUTOMATIC)({ baseUrl });
    xhr.get(url).then(result => {
      const { ret_code, data = {} } = result;
      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject;
      }
    });
  });
};

export const saveShipMethod = (requestData, baseUrl) => {
  return new Promise((resolve, reject) => {
    const url = template(ESTORE_SAVE_SHIP_METHOD)({ baseUrl });
    xhr.post(url, requestData).then(result => {
      const { ret_code, data = {} } = result;
      console.log(ret_code === 200000, 'ret_code:*********** ', ret_code);
      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject(ret_code);
      }
    });
  });
};

export const saveAddress = (requestData, baseUrl) => {
  return new Promise((resolve, reject) => {
    const url = template(ESTORE_SAVE_ADDRESS)({ baseUrl });
    xhr.post(url, requestData).then(result => {
      const { ret_code, data = {} } = result;
      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject(ret_code);
      }
    });
  });
};

export const createOrder = (requestData, baseUrl) => {
  return new Promise((resolve, reject) => {
    const url = template(ESTORE_CREATE_ORDER)({ baseUrl });
    xhr.post(url, requestData).then(result => {
      const { ret_code, data = {} } = result;
      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject(ret_code);
      }
    });
  });
};

export const preparePayment = ({ channel, baseUrl, additional = {} }) => {
  return new Promise((resolve, reject) => {
    const result = {
      data: null,
      isShopCartEmpty: false,
    };
    const url = template(ESTORE_PAYMENT_PREPARE)({ baseUrl });
    xhr.post(url, { channel, ...additional }).then(res => {
      const { ret_code, data = {} } = res;
      console.log(ret_code === 200000, 'ret_code:*********** ', ret_code);
      switch (ret_code) {
        case 200000: {
          result.data = data;
          break;
        }
        case 400863: {
          result.isShopCartEmpty = true;
          break;
        }
        default:
          reject(ret_code);
          break;
      }
      resolve(result);
    });
  });
};

export const getCartNum = ({ estoreBaseUrl }) => {
  return new Promise((resolve, reject) => {
    const url = template(ESTORE_GET_CART_NUM)({ baseUrl: estoreBaseUrl });
    xhr.get(url).then(result => {
      const { ret_code, data = {} } = result;
      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject;
      }
    });
  });
};
