import request from '@resource/websiteCommon/utils/ajax';
import { template } from './template';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import {
  SAVE_ORDER_ADDRESS,
  GET_NORMAL_ADDRESS,
  GET_ORDER_ADDRESS
} from '../constants/apiUrl';

/**
 * 保存地址
 * @param opt
 * @returns {Promise<unknown>}
 */
 export const saveOrderAddress = (opt = {}) => {
  const { address, order_number, a_type } = opt;
  return new Promise((resolve, reject) => {
    request({
      url: `${SAVE_ORDER_ADDRESS}`,
      method: 'post',
      setJSON: true,
      data: {
        address,
        order_number,
        a_type
      },
      success: result => {
        const newResult = typeof result === 'string' ? JSON.parse(result) : result;
        const { ret_code } = newResult;
        if (ret_code === 200000) {
          resolve(newResult);
        } else {
          reject(newResult);
        }
      },
      error: () => {
        const result = { respCode: '2000', respMsg: 'failed' };
        reject(result);
      }
    });
  });
};

/**
 * 获取地址详情
 * @returns {Promise<unknown>}
 */
 export const getAddressDetail = address_id => {
  return new Promise((resolve, reject) => {
    const url = template(GET_NORMAL_ADDRESS, {
      addressId: address_id
    });
    request({
      url: url,
      success: result => {
        const newResult = typeof result === 'string' ? JSON.parse(result) : result;
        const { ret_code, data = {} } = newResult;
        if (ret_code === 200000) {
          resolve(data);
        } else {
          reject();
        }
      },
      error: () => {
        const result = { respCode: '2000', respMsg: 'failed' };
        reject(result);
      }
    });
  });
};

/**
 * 根据订单号获取地址
 * @param  {[type]} order_number [description]
 * @return {[type]}              [description]
 */
 export const getAddressDetailByOrder = (order_number) => {
  return new Promise((resolve, reject) => {
    const url = template(GET_ORDER_ADDRESS, {
      order_number
    });
    request({
      url: url,
      success: result => {
        const newResult = typeof result === 'string' ? JSON.parse(result) : result;
        const { ret_code, data = {} } = newResult;
        if (ret_code === 200000) {
          resolve(data);
        } else {
          reject();
        }
      },
      error: () => {
        const result = { respCode: '2000', respMsg: 'failed' };
        reject(result);
      }
    });
  });
}