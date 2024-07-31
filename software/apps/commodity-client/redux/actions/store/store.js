import QS from 'qs';

import { wrapPromise } from '@resource/lib/utils/promise';

import { UPDATE_PRINT_PSTORE_INFO } from '@apps/commodity-client/constants/actionTypes';
import {
  CLIENT_AUTH_LOGIN,
  CLONE_VIRTUAL_PROJECT_PROJECT,
  GET_COMMODITY_INFO
} from '@resource/lib/constants/apiUrl';

import { CALL_API } from '@resource/lib/middlewares/api';

import getDataFromState from '@apps/commodity-client/utils/getDataFromState';

import { getStoreUser } from '../../../services/user';

const fetchUserInfo = async ({ dispatch, baseUrl, resolve, reject, enc_sw_id }) => {
  const res = await getStoreUser({ baseUrl, enc_sw_id });
  let payload = {
    enc_sw_id: enc_sw_id,
    userInfo: {
      user: true,
    },
    isLogin: false,

  };
  if (res && res.ret_code === 200000) {
    const data = res.data;

    payload = {
      userInfo: {
        id: data.id,
        client_identify: data.client_identify,
        customer_id: data.customer_id,
      },
      isLogin: true,
    };
  }

  dispatch &&
    dispatch({
      type: UPDATE_PRINT_PSTORE_INFO,
      data: payload,
    });
  resolve && resolve(res);
  return res;
};



/**
 * 获取详细信息
 */
const storeSign = params => {
  const { client_identity, fromGallery = false } = params || {};
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { urls, qs } = getDataFromState(getState());
      const baseUrl = urls.get('baseUrl');
      const enc_sw_id = qs.get('enc_sw_id');

      if (!enc_sw_id) {
        const err = new Error('enc_sw_id is required');
        console.error(err);
        return;
      }
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: CLIENT_AUTH_LOGIN,
            params: {
              baseUrl: baseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              client_identity,
              enc_sw_id
            }),
          },
        },
      })
        .then(() => {
          fetchUserInfo({
            dispatch,
            baseUrl,
            reject,
            resolve,
            enc_sw_id
          });
        })
        .catch(() => { });
    });
  };
};

const getCommodityUserInfo = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { urls, qs } = getDataFromState(getState());
      const baseUrl = urls.get('baseUrl');
      const enc_sw_id = qs.get('enc_sw_id');

      fetchUserInfo({
        dispatch,
        baseUrl,
        reject,
        resolve,
        enc_sw_id
      });
    });
  };
};



const updateCommodityUserInfo = data => {
  return {
    type: UPDATE_PRINT_PSTORE_INFO,
    data,
  };
};


export default {
  storeSign,
  updateCommodityUserInfo,
  getCommodityUserInfo,
};
