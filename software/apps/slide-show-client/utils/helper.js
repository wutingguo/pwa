import {template} from 'lodash';
import {SET_IMAGE_URL} from '@apps/slide-show-client/constants/imageUrl';
/**
* 获取图片地址
 * @param {string} imageUid 图片 image_uid
 */
export function getImageUrl(imageUid) {
  if(imageUid) {
    return template(SET_IMAGE_URL)({imageUid});
  }
}

const getCacheKey = key => {
  return `__Slideshow_CLIENT_${key}__`;
};

export const getEmailCacheKey = id => {
  return getCacheKey(`${id}_EMAIL`);
}

export const getGuestUidCacheKey = id => {
  return getCacheKey(`${id}_GUEST_UID`);
}
