import Immutable from 'immutable';
import { template, merge, get } from 'lodash';
import qs from 'qs';
import memoizeOne from 'memoize-one';

import {
  defaultStyle
} from '../../../constants/strings';
import { getShadowOffset } from '@resource/lib/utils/shadow';
import { elementTypes } from '@resource/lib/constants/strings';
import securityString from '@resource/lib/utils/securityString';
import { hexToRGBA } from '@resource/lib/utils/colorConverter';

import {
  IMAGES_CROPPER,
  IMAGES_API
} from '@resource/lib/constants/apiUrl';
import { IMAGES_FILTER_PARAMS_WITH_ORIENTATION, IMAGES_CROPPER_PARAMS_WITH_ORIENTATION } from '@resource/lib/constants/apiUrl';
import { URL_MATTING_MASK_IMG } from '../../../constants/apiUrl';
import { getCropOptionsByLR } from '@resource/lib/utils/crop';

const MIN_PHOTO_HEIGHT = 180;
const MIN_PHOTO_WIDTH = 180;
const MIN_TEXT_HEIGHT = 140;
const MIN_TEXT_WIDTH = 140;


/**
 * 计算element的显示时的宽高和left,top值.
 * @param  {object} that BookPage的this指向
 * @param  {object} element 原始数据
 * @param  {number} ratio 原始值与显示值的缩放比
 */

export const computedElementOptions = (props, element, workspaceRatio) => {
  const {
    urls,
    page,
    images
  } = props;

  const ratio = workspaceRatio;
  const encImgId = element.get('encImgId');
  const theImage = images.find(i => i.get('encImgId') == encImgId);
  const imgRatio = theImage ? theImage.get('width') / theImage.get('height') : 1;
  const mattingMaskId = element.getIn(['imageMatting', 'finalMaskId']);
  let obj = {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    imgUrl: '',
    mattingMaskUrl: ''
  };

  // TODO.
  // imgRot不知道在什么地方有遗漏, 导致还是undefined.
  const imageRotate = element.get('imgRot') || 0;
  const exifOrientation = element.get('exifOrientation') || 1;
  const imgFlip = element.get('imgFlip');
  const pageWidth = page.get('width');
  const pageHeight = page.get('height');

  // 计算element的显示宽高
  obj.width = pageWidth * element.get('pw') * ratio;
  obj.height = pageHeight * element.get('ph') * ratio;

  let fillImageWidth = 1000;
  if (theImage) {
    const cropPW = element.get('cropRLX') - element.get('cropLUX');
    const cropPH = element.get('cropRLY') - element.get('cropLUY');
    const maxLength = Math.max(obj.width, obj.height);
    if (imgRatio > 1) {
      fillImageWidth = Math.ceil((maxLength * imgRatio) / cropPW);
    } else {
      fillImageWidth = Math.ceil(maxLength / imgRatio / cropPH);
    }
  }

  // 计算element的left和top值
  obj.left = pageWidth * element.get('px') * ratio;
  obj.top = pageHeight * element.get('py') * ratio;

  obj.elementBleed = {
    top: element.get('bleedTop') ? element.get('bleedTop') * ratio : 0,
    left: element.get('bleedLeft') ? element.get('bleedLeft') * ratio : 0,
    right: element.get('bleedRight') ? element.get('bleedRight') * ratio : 0,
    bottom: element.get('bleedBottom') ? element.get('bleedBottom') * ratio : 0
  };


  switch (element.get('type')) {
    case elementTypes.photo: {
      obj.keepRatio = false;
      obj.minHeight = Math.round(MIN_PHOTO_HEIGHT * ratio);
      obj.minWidth = Math.round(MIN_PHOTO_WIDTH * ratio);
      if (encImgId) {
        const gradient = element.getIn(['style', 'gradient']);
        const isGradientEnable = gradient && gradient.get('gradientEnable');

        // 根据宽度来计算当前整图的尺寸 700/1000/1500
        let cropOptions = getCropOptionsByLR(0, 0, 1, 1, fillImageWidth, fillImageWidth);
        console.log('elements', cropOptions);

        if (isGradientEnable && element.get('cropRLY')) {
          cropOptions = getCropOptionsByLR(
            element.get('cropLUX'),
            element.get('cropLUY'),
            element.get('cropRLX'),
            element.get('cropRLY'),
            obj.width,
            obj.height
          );
        }

        if (cropOptions) {
          const shape = 'rect';
          let filterOptions = merge({}, defaultStyle);
          if (element.get('style')) {
            filterOptions = merge({}, defaultStyle, element.get('style').toJS());
          }

          obj.imgUrl = template(`${IMAGES_API}${IMAGES_FILTER_PARAMS_WITH_ORIENTATION}`)(
            merge({}, cropOptions, filterOptions, {
              encImgId,
              imgFlip,
              shape,
              rotation: imageRotate,
              exifOrientation,
              baseUrl: urls.get('baseUrl'),
              ...securityString
            })
          );

          if (isGradientEnable) {
            obj.imgUrl += `&${qs.stringify(element.getIn(['style', 'gradient']).toJS())}`;
          }

          obj.corpApiTemplate =
            template(IMAGES_CROPPER)({
              baseUrl: urls.get('baseUrl')
            }) + IMAGES_CROPPER_PARAMS_WITH_ORIENTATION;
          obj.filterApiTemplate =
            template(IMAGES_API)({
              baseUrl: urls.get('baseUrl')
            }) + IMAGES_FILTER_PARAMS_WITH_ORIENTATION;
        }

        // 计算border
        const border = element.get('border');
        if (border) {
          const rbga = hexToRGBA(border.get('color'), border.get('opacity'));
          obj.border = {
            size: border.get('size') * ratio,
            color: rbga
          };
        }

        const shadow = element.getIn(['style', 'shadow']);
        if (shadow && shadow.get('enable')) {
          const { x, y } = getShadowOffset(shadow.get('angle'), shadow.get('distance') * ratio);
          obj.shadow = {
            stroke: 'rgba(0,0,0,0)',
            shadowColor: shadow.get('color'),
            shadowBlur: shadow.get('blur') * ratio,
            shadowEnabled: shadow.get('enable'),
            shadowOpacity: shadow.get('opacity') / 100,
            shadowOffsetX: x,
            shadowOffsetY: y
          };
        }

        //复制蒙板url
        if (mattingMaskId) {
          obj.mattingMaskUrl = template(URL_MATTING_MASK_IMG)({
            baseUrl: urls.get('galleryBaseUrl'),
            maskId: mattingMaskId
          });
        }
      }

      break;
    }
    default:
      break;
  }

  // 只要其中的width或height为0, 那么就不要请求图片, 因为该数据就是无效的图片路径, 会引起服务器返回601错误.
  if (!obj.width || !obj.height) {
    obj.imgUrl = '';
  }

  return Immutable.fromJS(obj);
};

export const convertElements = (props) => {
  let outList = Immutable.List();
  const { page, ratio } = props;
  const elements = page.get('elements');
  elements.forEach(element => {
    const computed = computedElementOptions(props, element, ratio);
    outList = outList.push(element.merge({ computed }));
  });

  return outList;
}

export const memoizeConvertElements = memoizeOne(convertElements, (newValue, oldValue) => {
  const { page: newPage, ratio: newRatio } = newValue[0]; 
  const { page, ratio } = oldValue[0]; 
  const isEqual = newPage == page && newRatio == ratio;
  console.log('isEqual', isEqual, oldValue)
  return isEqual;
});

