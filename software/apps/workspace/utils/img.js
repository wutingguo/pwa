import {
  DEFAULT_COVER_IMAGE_URL_US,
  DEFAULT_COVER_IMAGE_URL_JA,
  DEFAULT_COVER_IMAGE_URL_DE
} from '../constants/apiUrl';

import { isHttpUrl } from './url';
import { CDN_PREFIX } from '../constants/strings';

export function checkIsAlphaImg(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, img.width, img.height);

  for (let i=0; i<imgData.data.length; i+=4) {
    const alpha = imgData.data[i+3];
    if (alpha === 0) {
      return true;
    }
  }

  return false;
}

/**
 * 根据语言获取对应图片
 * @param {string} lang 语言
 * @param {string} key 图片标识，用来区分不同图片
 */
export function getImageByLanguage(key, lang='en') {
  const imgConfig = {
    defaultCoverImage: {
      en: DEFAULT_COVER_IMAGE_URL_US,
      ja: DEFAULT_COVER_IMAGE_URL_JA,
      de: DEFAULT_COVER_IMAGE_URL_DE
    }
  }
  if(!key || !imgConfig[key]) {
    return;
  }
  return imgConfig[key][lang];
}

export const isProductEnv = () => {

  return (
    typeof window !== 'undefined' && /^www\.zno\.com$/.test(document.domain)
  );
};

export function getImageUrl(imgSrc) {
  if (isHttpUrl(imgSrc)) {
    return imgSrc;
  }

  return imgSrc && isProductEnv() ? `${CDN_PREFIX}${imgSrc}` : imgSrc;
}
