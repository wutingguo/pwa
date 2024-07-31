import { template } from 'lodash';

import { getDegree, getOrientationAppliedStyle } from '@resource/lib/utils/exif';

import {
  CROP_IMAGE_URL,
  DOWN_URL,
  IMAGE_URL,
  ROTATE_IMAGE_URL,
} from '@apps/live-photo-client-mobile/constants/imageUrl';

/**
 * 获取图片地址
 * @param {*} baseUrl
 * @param {*} enc_image_uid
 * @param {*} thumbnail_size
 * @returns
 */
export function getImageUrl(baseUrl, enc_image_uid, thumbnail_size = 5) {
  if (enc_image_uid) {
    return template(IMAGE_URL)({ baseUrl, enc_image_uid, thumbnail_size });
  }
}
/**
 * 获取旋转后图片地址
 * @param {*} baseUrl
 * @param {*} encImgId
 * @returns
 */
export function getRotateImageUrl({ baseUrl, enc_image_uid, thumbnail_size = 5 }) {
  if (enc_image_uid) {
    return template(ROTATE_IMAGE_URL)({ baseUrl, enc_image_uid, thumbnail_size });
  }
}

/**
 * 获取旋转后图片地址
 * @param {*} baseUrl
 * @param {*} encImgId
 * @param {*} exifOrientation 旋转角度
 * @returns
 */
export function getCropImageUrl({ baseUrl, encImgId, exifOrientation, width = 500, height = 500 }) {
  if (encImgId) {
    const rotation = getDegree(exifOrientation);
    return template(CROP_IMAGE_URL)({
      baseUrl,
      encImgId,
      width,
      height,
      rotation,
      exifOrientation,
    });
  }
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

const getCacheKey = key => {
  return `__GALLERY_CLIENT_${key}__`;
};

export const getUserUniqueIdCacheKey = id => {
  return getCacheKey(`${id}_USER_ID`);
};
