import { elementTypes } from '@resource/lib/constants/strings';

export const updateEffectKeys = ['x', 'y', 'width', 'height'];


export const noSelectElementTypes = [elementTypes.background];

export const mouseWheel = {
  width: 50,
  height: 50,
};

export const decorationResourceTypes = {
  sticker: 'STICKER',
  background: 'BACKGROUND',
  calendar: 'CALENDAR',
};

export const defaultApplyObjMeta = {
  edit: {
    allowMove: true,
    allowRotate: true,
    allowResize: true,
    allowModify: true,
    allowChangeColor: false,
  },
};

export const defaultCraftMeta = {
  allowedCraft: [],
};

export const stickerTypes = {
  // 线条
  Lines: 'LN',
  // 标签
  Labels: 'LB',
  // 贴花
  Appliques: 'AL',
  // 角花
  Flourishes: 'FR',
  // 半色调
  Halftones: 'HT',
  // 叠加
  Overlays: 'OL',
  // 飞溅
  Splatters: 'SL',
  // 笔触
  Strokes: 'SK',
  // 文字
  Words: 'WD',
  // 蒙版
  Masks: 'MK',
  // 其他 无法分进具体类别的
  Others: 'OT',
  // 插画
  Illustration: 'IL',
  // 肌理
  Texture: 'TT',
  // 照片框
  Frame: 'FM',
};

export const gradientTypes = {
  linear: 'line',
  linear2: '2line',
  circular: 'round',
  diamond: 'diamond',
  rectangle: 'rectangle'
};

export const defaultStyle = {
  opacity: 100,
  brightness: 0,
  contrast: 0,
  saturation: 100,
  effectId: 0,
  gradient: {
    gradientEnable: false,
    gradientType: gradientTypes.linear,
    gradientAngle: 90,
    gradientMidpoint: 0.5
  },
  shadow: {
    enable: false,
    color: '#000000',
    blur: 50,
    opacity: 50,
    angle: 45,
    distance: 25
  }
};
