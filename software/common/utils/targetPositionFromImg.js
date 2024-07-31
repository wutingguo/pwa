import { toObjectUrl } from '@resource/lib/utils/draw';
import { fetchImage } from '@resource/lib/utils/image';

const calculateImgSide = ({ width, height, size }) => {
  const ratio = width / height;
  let w = width;
  let h = height;
  if (width > height) {
    w = size;
    h = size / ratio;
  } else if (width < height) {
    h = size;
    w = size * ratio;
  }
  return [w, h, w / width];
};

const getScreenSide = (sw, sh, width, height, type = 'full') => {
  const sRtatio = sw / sh;
  sw = width;
  sh = sw / sRtatio;
  // 铺满容器
  if (type === 'full') {
    if (sh < height) {
      sh = height;
      sw = sh * sRtatio;
    }
    return [sw, sh];
  }
  sw = width;
  sh = sw / sRtatio;
  if (sh > height) {
    sh = height;
    sw = sh * sRtatio;
  }
  return [sw, sh];
};

/**
 * @param {Number} x, y, w, h  需要截取部分的 左上角坐标以及宽高
 * @param {Number} size  目标位置的坐标以最长边不超过 size 的长度为基准计算的
 * @param {Number} areaW, areaH  盛放图片容器的宽高
 * @param {Number} width， height 图片的宽高
 * @param {String} imgUrl 图片的地址
 * @returns {String} 处理后图片的地址
 */
const getTargetPositionImg = ({ x, y, w, h, size, imgUrl, areaW, areaH }) => {
  return new Promise((resolve, reject) => {
    if (!x || !y || !w || !h || x === '0' || y === '0' || w === '0' || h === '0') {
      return resolve(imgUrl);
    }
    fetchImage(imgUrl).then(img => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const { width, height } = img;
      const [imgW, imgH, ratio] = calculateImgSide({ width, height, size });
      // console.log('width, height: ', width, height);
      // console.log('[imgW, imgH, ratio]: ', [imgW, imgH, ratio]);
      const cw = areaW || width;
      const ch = areaH || height;
      canvas.width = cw;
      canvas.height = ch;
      const startPoint = { x: x / ratio, y: y / ratio };
      const sw = w / ratio + 40;
      const sh = h / ratio + 60;
      const sx = startPoint.x - 20;
      const sy = startPoint.y - 50;
      const [rw, rh] = getScreenSide(sw, sh, cw, ch);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, rw, rh);
      toObjectUrl(canvas).then(resolve, reject);
    });
  });
};

/**
 * @param {Number} x, y, w, h  需要截取部分的 左上角坐标以及宽高
 * @param {Number} width, height  目标图片的原始宽高
 * @param {Number} areaW, areaH  盛放图片容器的宽高
 * @param {String} imgUrl 图片的地址
 * @returns {String} 处理后图片的地址
 */
export const getRelativePositionImg = ({ x, y, w, h, imgUrl, width, height, areaW, areaH }) => {
  return new Promise((resolve, reject) => {
    if (!x || !y || !w || !h || x === '0' || y === '0' || w === '0' || h === '0') {
      return resolve(imgUrl);
    }
    fetchImage(imgUrl).then(img => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const { width: iw, height: ih } = img;
      const ratio = iw / width;
      const cw = areaW || iw;
      const ch = areaH || ih;
      canvas.width = cw;
      canvas.height = ch;
      const startPoint = { x: x * width * ratio, y: y * height * ratio };
      const sw = w * width * ratio + 40;
      const sh = h * height * ratio + 60;
      const sx = startPoint.x - 20;
      const sy = startPoint.y - 50;
      const [rw, rh] = getScreenSide(sw, sh, cw, ch);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, rw, rh);
      toObjectUrl(canvas).then(resolve, reject);
    });
  });
};

export default getTargetPositionImg;
