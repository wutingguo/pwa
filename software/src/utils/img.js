import {
  DEFAULT_COVER_IMAGE_URL
} from '@apps/workspace/constants/apiUrl';

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
export function getImageByLanguage() {
  return DEFAULT_COVER_IMAGE_URL;
}
