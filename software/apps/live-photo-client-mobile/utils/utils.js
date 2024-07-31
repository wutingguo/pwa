import dayjs from 'dayjs';

import { toObjectUrl } from '@resource/lib/utils/draw';
import { fetchImage } from '@resource/lib/utils/image';

export const countDown = (waitTime, doSomethingDuringCountDown, doSomethingAfterCountDown) => {
  if (waitTime > 0) {
    waitTime--;
    if (doSomethingDuringCountDown) {
      doSomethingDuringCountDown(waitTime);
    }
  } else {
    if (doSomethingAfterCountDown) {
      doSomethingAfterCountDown(waitTime);
    }
    return;
  }
  setTimeout(() => {
    countDown(waitTime, doSomethingDuringCountDown, doSomethingAfterCountDown);
  }, 1000);
};

export const trimFileName = (fileName, maxSize = 25, retainDataLenth = 10) => {
  if (fileName.length < maxSize) {
    return fileName;
  }
  return `${fileName.substr(0, retainDataLenth)}...${fileName.substr(
    fileName.length - retainDataLenth
  )}`;
};

/**
 * 获取图片的头像位置
 * @param {object} imageInfo 头像原始图片信息
 * @param {object} item 当前头像信息
 */
export const getImagePositionXY = (imageInfo, item) => {
  // 原图的宽高
  const { width: originWidth, height: originHeight } = imageInfo;
  const { x = 0, y = 0, width = 0, height = 0 } = item;
  const positionX = ((x * originWidth + (width * originWidth) / 2) / originWidth) * 100;
  const positionY = ((y * originHeight + (height * originHeight) / 2) / originHeight) * 100;
  const isUsed2 = height > 0.5 || width > 0.5;

  return { positionX, positionY, isUsed2 };
};

/**
 * 判断图片的后缀符合[.png, .jpg, .jpeg]
 * @param {File} file 文件
 */
export const judgeImageSuffix = file => {
  const acceptSuffix = ['png', 'jpg', 'jpeg'];
  const suffix = file.name.split('.').pop();
  return !acceptSuffix.includes(suffix.toLocaleLowerCase());
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

/**
 * 用canvas截取图片中的人脸
 * @param {Object} params
 * @param {string} params.originSrc 原图地址
 * @param {Array} params.itemList 人脸信息数组
 * @returns {Promise<Array>} 返回人脸图片地址
 */
export const getFaceAvatarList = ({ originSrc, itemList }) => {
  const promises = itemList.map(async item => {
    const { x, y, width: w, height: h } = item;

    return new Promise(resolve => {
      fetchImage(originSrc).then(async img => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const { width, height } = img;
        const [sw, sh, sx, sy] = getScreenSide(w * width, h * height, x * width, y * height);
        canvas.width = sw;
        canvas.height = sh;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
        try {
          const dataURL = await toObjectUrl(canvas);
          item.avatarSrc = dataURL;
          resolve(item);
        } catch (error) {
          resolve(item);
        }
      });
    });
  });

  return Promise.all(promises);
};

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
      resolve('');
    }
  });
};

/**
 * 获取图片列表最后记录的信息
 * @param {Array} images 图片列表
 */
export const getLastInfoByList = (images = []) => {
  const last_shot_time = images[images.length - 1].shot_time;
  const last_shot_time_en = images[images.length - 1].shot_time_str;

  const last_repeat_album_content_rel_id = images
    .filter(({ shot_time }) => shot_time === last_shot_time)
    .map(({ enc_album_content_rel_id }) => enc_album_content_rel_id)
    .join(',');

  return {
    lastShotTime: last_shot_time_en
      ? last_shot_time_en
      : dayjs(last_shot_time).format('YYYY-MM-DD HH:mm:ss'),
    lastRepeatAlbumContentRelId: last_repeat_album_content_rel_id,
  };
};
