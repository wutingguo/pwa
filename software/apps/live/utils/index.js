import { template } from 'lodash';

import { toObjectUrl } from '@resource/lib/utils/draw';
import { toPage } from '@resource/lib/utils/history';

import * as modalTypes from '@resource/lib/constants/modalTypes';
import { aiphotoDelicacyInfo, aiphotoInfoFields } from '@resource/lib/constants/priceInfo';
import { aiphotoInfo, livePhotoInfo, saasProducts } from '@resource/lib/constants/strings';

import { DOWN_URL } from '@apps/live/constants/strings';

export const prepareOpenAIModal = params => {
  const { boundGlobalActions, urls } = params;
};

export function openPayCard(
  { boundGlobalActions, baseUrl, sliceNumber, annualItem },
  type = 'live',
  isCN = true
) {
  // 兼容英文
  if (!isCN) {
    if (type === 'aiphoto') {
      // 按张收费跳转pricing-ai retoucher-Order
      toPage(`/saascheckout.html?product_id=${saasProducts.retoucher}`);
    } else if (type === 'aiphotoField') {
      // 按场收费跳转pricing-ai retouch with With Zno Instant™ One Event
      toPage(`/saascheckout.html?product_id=${saasProducts.retoucherZI}`);
    }
    return;
  }
  let params = null;
  if (type === 'live') {
    // 兼容包年免费版
    const item = annualItem ? annualItem : livePhotoInfo[sliceNumber];
    const liveParams = {
      ...item,
      combos: [...livePhotoInfo.slice(sliceNumber)],
    };
    params = {
      product_id: saasProducts.live,
      liveParams: annualItem ? null : liveParams, // 包年订阅置为null调用接口
      level: item.level_id,
      cycle: item.cycle_id,
    };
  } else if (type === 'aiphoto') {
    const item = aiphotoInfo[1];
    params = {
      product_id: saasProducts.aiphoto,
      aiphotoParams: {
        ...item,
        combos: aiphotoInfo.slice(1),
      },
      level: item.level_id,
      cycle: item.cycle_id,
    };
  } else if (type === 'aiphotoField') {
    const item = aiphotoInfoFields[0];
    params = {
      product_id: saasProducts.aiphoto,
      aiphotoParams: {
        ...item,
        combos: aiphotoInfoFields,
      },
      level: item.level_id,
      cycle: item.cycle_id,
    };
  } else if (type === 'retouch') {
    const item = aiphotoDelicacyInfo[0];
    params = {
      product_id: saasProducts.aiphoto,
      aiphotoParams: {
        ...item,
        // combos: aiphotoDelicacyInfo.filter(item=>item.id !== 25 && item.id !== 26),
        combos: aiphotoDelicacyInfo, // 改造
        subTab: 1,
      },
      level: item.level_id,
      cycle: item.cycle_id,
    };
  }
  boundGlobalActions.showModal(modalTypes.SAAS_CHECKOUT_MODAL, {
    ...params,
    escapeClose: true,
    onClosed: () => {
      boundGlobalActions.hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
      boundGlobalActions.getMySubscription(baseUrl);
    },
  });
}

/**
 *
 * @param {*} baseUrl
 * @param {*} enc_image_uid
 * @param {*} size
 * @returns string
 */
export function getDownloadUrl({ baseUrl, enc_image_uid, size = 1 }) {
  if (enc_image_uid) {
    return template(DOWN_URL)({ baseUrl, enc_image_uid, size });
  }
}

/**
 * 用canvas截取图片中的人脸一个一个识别
 * @param {Object} params
 * @param {Object} params.imgInfo 原图图片信息
 * @param {Object} params.item 人脸信息数组
 * @returns {Promise<string>} 返回人脸图片地址
 */
export const getFaceAvatarSrc = ({ imgInfo, item }) => {
  const { x, y, width: w, height: h } = item;

  return new Promise(async resolve => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const { width, height } = imgInfo;
    const [sw, sh, sx, sy] = getScreenSide(w * width, h * height, x * width, y * height);
    canvas.width = sw;
    canvas.height = sh;
    ctx.drawImage(imgInfo, sx, sy, sw, sh, 0, 0, sw, sh);
    try {
      const dataURL = await toObjectUrl(canvas);
      const avatarSrc = dataURL;
      resolve(avatarSrc);
    } catch (error) {
      console.error(error);
      resolve('');
    }
  });
};

/**
 * 返回canvas截取的头像sw sh sx sy组成正方形
 * @param {number} width 头像的宽
 * @param {number} height 头像的高
 * @param {number} x 头像的x坐标
 * @param {number} y 头像的y坐标
 * @returns {[number, number, number, number]} [sw, sh, sx, sy]
 */
const getScreenSide = (width, height, x, y) => {
  if (width > height) {
    const sw = width;
    const sh = width;
    const sx = x;
    const sy = y - (width - height) / 2;
    return [sw, sh, sx, sy];
  }
  const sw = height;
  const sh = height;
  const sx = x - (height - width) / 2;
  const sy = y;
  return [sw, sh, sx, sy];
};
