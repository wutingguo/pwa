import { wrapPromise } from '@resource/lib/utils/promise';

import {
  GET_CART_CREDIT,
  GET_CART_CREDIT_SHOW,
  ORDER_CREATE,
  ORDER_GET,
  ORDER_PRICE,
  SUBMIT_BILLING,
} from '@resource/lib/constants/apiUrl';

import { CALL_API } from '@resource/lib/middlewares/api';

// 初始化ds状态
const initDsState = payload => ({
  type: 'INIT_DS_STATE',
  payload,
});

// 更新ds数据
const updateDSData = payload => ({
  type: 'UPDATE_DS_STATE',
  payload,
});

// 关闭或者打开MODAL
const toggleModal = payload => ({
  type: 'TOGGLE_MODAL',
  payload,
});

// 关闭或者打开 ALERT
const toggleAlert = payload => ({
  type: 'TOGGLE_ALERT',
  payload,
});

// 关闭或者打开 ALERT
const togglePageConfirm = payload => ({
  type: 'TOGGLE_PAGE_CONFIRM',
  payload,
});

// 设置积分抵现
const setStoreCredit = payload => ({
  type: 'SET_STORE_CREDIT',
  payload,
});

// 更新排序规则
const setSequence = payload => ({
  type: 'SET_SEQUENCE',
  payload,
});

// 设置封面
const setCoverDesign = payload => ({
  type: 'SET_COVER_DESIGN',
  payload,
});

// 设置key
const setDesign = payload => ({
  type: 'SET_DESIGN',
  payload,
});

// 设置分组按钮
const setGroup = payload => ({
  type: 'SET_GROUP',
  payload,
});

// // 是否点击BACK 返回到该页面
// const setBack = (payload) => ({
//     type: "SET_BACK",
//     payload
// });

// order confirm页面数据
function getConfirmInfo(data) {
  return dispatch => {
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: ORDER_GET,
            params: {
              dsBaseUrl: data.saasBaseUrl,
              serviceOrderId: data.serviceOrderId,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
}

// 获取价格金额接口
function getPrice(payload) {
  return dispatch => {
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: ORDER_PRICE,
            params: {
              dsBaseUrl: payload.saasBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(payload),
          },
        },
      }).then(resolve, reject);
    });
  };
}

// 获取积分（用于减掉金额）·
const getCartCredit = payload => {
  return dispatch => {
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_CART_CREDIT,
            params: {
              dsBaseUrl: payload.saasBaseUrl,
              pages: payload.pages,
            },
          },
          options: {
            method: 'GET',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            // body: JSON.stringify(payload)
          },
        },
      }).then(resolve, reject);
    });
  };
};

// 购物车显示积分入口
const getCartCreditShow = payload => {
  return dispatch => {
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_CART_CREDIT_SHOW,
            params: {
              dsBaseUrl: payload.baseUrl,
            },
          },
          options: {
            method: 'GET',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};

// 创建订单
const orderCreate = payload => {
  return dispatch => {
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: ORDER_CREATE,
            params: {
              dsBaseUrl: payload.saasBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(payload),
          },
        },
      }).then(resolve, reject);
    });
  };
};

// 提交订单
const submitOrder = payload => {
  return dispatch => {
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SUBMIT_BILLING,
            params: {
              dsBaseUrl: payload.dsBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(payload),
          },
        },
      }).then(resolve, reject);
    });
  };
};

export default {
  setGroup,
  setCoverDesign,
  setSequence,
  toggleAlert,
  setStoreCredit,
  toggleModal,
  initDsState,
  updateDSData,
  orderCreate,
  getConfirmInfo,
  getPrice,
  submitOrder,
  getCartCredit,
  getCartCreditShow,
  setDesign,
  togglePageConfirm,
};
