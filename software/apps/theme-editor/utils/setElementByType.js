import Immutable from 'immutable';
import { isNumber, isUndefined } from 'lodash';
import { getCropOptions } from '@resource/lib/utils/crop';
import { elementTypes, taskTypes } from '@resource/lib/constants/strings';
import { toEncode } from '@resource/lib/utils/encode';

function setElement(element, thePage) {
  const percentAttrbuites = {};
  if (isNumber(element.get('x'))) {
    percentAttrbuites.px = element.get('x') / thePage.get('width');
  }

  if (isNumber(element.get('y'))) {
    percentAttrbuites.py = element.get('y') / thePage.get('height');
  }

  if (isNumber(element.get('width'))) {
    percentAttrbuites.pw = element.get('width') / thePage.get('width');
  }

  if (isNumber(element.get('height'))) {
    percentAttrbuites.ph = element.get('height') / thePage.get('height');
  }

  return element.merge(percentAttrbuites, {
    lastModified: Date.now()
  });
}

function setTextElement(element, thePage) {
  const percentAttributes = {};

  const fontSize = element.get('fontSize');
  // 最小字号1pt转像素为 4.17
  if (fontSize && fontSize > 4.17) {
    percentAttributes.fontSize = element.get('fontSize') / thePage.get('height');
  }

  return setElement(element, thePage).merge(percentAttributes);
}

function addDefaultPhotoElementAttrs(element) {
  const outObj = {};
  const needFillAttrKeys = ['imgFlip', 'imgRot', 'encImgId'];

  needFillAttrKeys.forEach(key => {
    switch (key) {
      case 'imgFlip': {
        if (isUndefined(element.get(key))) {
          outObj.imgFlip = false;
        }
        break;
      }

      case 'imgRot': {
        if (isUndefined(element.get(key))) {
          outObj.imgRot = 0;
        }
        break;
      }
      default:
    }
  });

  return Immutable.fromJS(outObj);
}

function setPhotoElement(element, thePage) {
  const calculateAttrbuites = {
    cropLUX: 0,
    cropLUY: 0,
    cropRLX: 1,
    cropRLY: 1
  };

  const originalElement = thePage.get('elements').find(o => {
    return o.get('id') === element.get('id');
  });

  return setElement(element, thePage) // 补全  px ph等等属性
    .merge(calculateAttrbuites)
    .merge(addDefaultPhotoElementAttrs(element.merge(originalElement)));
}

function setBackgroundElement(element, thePage) {
  const calculateAttrbuites = {
    cropLUX: 0,
    cropLUY: 0,
    cropRLX: 1,
    cropRLY: 1
  };

  return setElement(element, thePage).merge(calculateAttrbuites);
}

function setStickerElement(element, thePage) {
  const percentAttrbuites = {};
  const originalElement = thePage.get('elements').find(o => {
    return o.get('id') === element.get('id');
  });

  const decorationId =
    element.get('decorationId') ||
    element.get('encImgId') ||
    originalElement.get('decorationId') ||
    originalElement.get('encImgId');

  const isMaskType =
    element.get('maskType') || (originalElement && originalElement.get('maskType'));

  const theStickerImage = originalElement.get('img');

  if (theStickerImage) {
    const stickerRatio = theStickerImage.width / theStickerImage.height;

    if (isNumber(element.get('width'))) {
      const elementHeight = element.get('width') / stickerRatio;
      percentAttrbuites.pw = element.get('width') / thePage.get('width');
      percentAttrbuites.ph = elementHeight / thePage.get('height');
      percentAttrbuites.width = element.get('width');
      percentAttrbuites.height = elementHeight;
    } else if (isNumber(element.get('height'))) {
      const elementWidth = element.get('height') * stickerRatio;
      percentAttrbuites.ph = element.get('height') / thePage.get('height');
      percentAttrbuites.pw = elementWidth / thePage.get('width');
      percentAttrbuites.width = elementWidth;
      percentAttrbuites.height = element.get('height');
    }
  }

  if (isNumber(element.get('x'))) {
    percentAttrbuites.px = element.get('x') / thePage.get('width');
  }

  if (isNumber(element.get('y'))) {
    percentAttrbuites.py = element.get('y') / thePage.get('height');
  }

  return element.merge(percentAttrbuites, {
    lastModified: Date.now()
  });
}

export function verifyUpdateAttributes(element) {
  let outElement = element;
  const needVerifyKeys = [
    'x',
    'y',
    'width',
    'height',
    'px',
    'py',
    'pw',
    'ph',
    'cropLUX',
    'cropLUY',
    'cropRLX',
    'cropRLY'
  ];
  element.forEach((value, key) => {
    if (needVerifyKeys.indexOf(key) !== -1 && !isNumber(value)) {
      outElement = outElement.remove(key);
    }
  });

  const fontFamily = outElement.get('fontFamily');
  const text = outElement.get('text');

  if (fontFamily) {
    outElement = outElement.set('fontFamily', toEncode(fontFamily));
  }

  if (text) {
    outElement = outElement.set('text', toEncode(text));
  }

  return outElement;
}

export default function setElementByType({ element, thePage }) {
  let newElement = verifyUpdateAttributes(element);
  switch (newElement.get('type')) {
    case elementTypes.text:
      newElement = newElement.merge(setTextElement(newElement, thePage));
      return newElement;
    case elementTypes.photo:
      const newOption = setPhotoElement(newElement, thePage);
      return newElement.merge(newOption);
    case elementTypes.background: {
      const newOption = setBackgroundElement(newElement, thePage);
      return newElement.merge(newOption);
    }
    case elementTypes.sticker: {
      newElement = newElement.merge(setStickerElement(newElement, thePage));
      return newElement;
    }

    default:
      newElement = newElement.merge(setElement(newElement, thePage));
      return newElement;
  }
}
