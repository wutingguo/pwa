import memoizeOne from 'memoize-one';

import { wrapPromise } from '@resource/lib/utils/promise';

import { elementTypes } from '@resource/lib/constants/strings';

import { getRenderElementOptions } from '../../../utils/canvas/helper';

/**
 * 获取蒙板图片,该方法要同时预加载一下原图
 * ps:如果蒙板图片先于原图加载完成，会导致渲染不出任何东西
 * @param {*} renderElement
 * @param {*} boundProjectActions
 */
export function obtainMaskImgObj(that) {
  const { boundProjectActions } = that.props;
  const photoElement = getCurrentPhotoElement(that);
  if (!photoElement) return;
  const mattingMaskObj = photoElement.getIn(['imageMatting', 'mattingMaskObj']);
  if (mattingMaskObj) return;
  const { mattingMaskUrl, imgUrl } = getRenderElementOptions(photoElement);
  const oldImageMatting = photoElement.get('imageMatting')?.toJS() || {};
  const maskImage = new Image();
  const sourceImage = new Image();
  const maskPromise = wrapPromise((resolve, reject) => {
    maskImage.onload = () => {
      resolve();
    };
    maskImage.src = mattingMaskUrl;
  });
  const sourcePromise = wrapPromise((resolve, reject) => {
    sourceImage.onload = () => {
      resolve();
    };
    sourceImage.src = imgUrl;
  });
  Promise.all([sourcePromise, maskPromise]).then(res => {
    boundProjectActions.updateElement({
      id: photoElement.get('id'),
      imageMatting: {
        ...oldImageMatting,
        mattingMaskObj: maskImage,
      },
    });
  });
}

export function getCurrentMaskImgObj(that) {
  const photoElement = getCurrentPhotoElement(that);
  const mattingMaskObj = photoElement?.getIn(['imageMatting', 'mattingMaskObj']);
  return mattingMaskObj;
}

export function getCurrentPhotoElement(that) {
  const { elementArray } = that.state;
  const photoElement = elementArray.find(ele => ele.get('type') == elementTypes.photo);
  return photoElement;
}

/**
 * 根据蒙板图片对象创建蒙板滤镜
 * @param {object} mattingMaskObj
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @returns
 */
export function createMattingMaskFilter(that, mattingMaskObj) {
  /**
   * imageData是原图图像数据
   */
  return function (imageData) {
    const canvasWidth = imageData.width;
    const canvasHeight = imageData.height;
    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d');
    tmpCanvas.width = canvasWidth;
    tmpCanvas.height = canvasHeight;
    tmpCtx.drawImage(mattingMaskObj, 0, 0, canvasWidth, canvasHeight);
    const maskImageData = tmpCtx.getImageData(0, 0, canvasWidth, canvasHeight);
    var nPixels = imageData.data.length;
    for (let i = 3; i < nPixels; i += 4) {
      const bValueInMask = maskImageData.data[i - 1];
      const alphaValueInMask = maskImageData.data[i];
      const isGrayPixel = bValueInMask > 0 && bValueInMask < 255;
      let alphaValueInTarget = imageData.data[i];
      //蒙板上只会出现黑白灰三种颜色，理论上黑色和白色其实不会出现半透明的值
      //这里为了避免这种情况，做了下兼容处理
      //如果当前像素点是白色，当前像素点的alpha通道值即为源图对应像素的alpha通道值
      //如果当前像素点是黑色，255-当前像素点的alpha通道值即为源图对应像素的alpha通道值
      if (bValueInMask == 0) {
        alphaValueInTarget = alphaValueInTarget * (1 - alphaValueInMask / 255);
      } else if (isGrayPixel) {
        //灰色代表是半透明，直接指导计算目标像素的半透明值
        alphaValueInTarget = alphaValueInTarget * (bValueInMask / 255);
      }
      imageData.data[i] = alphaValueInTarget;
    }
  };
}
