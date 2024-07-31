import { elementTypes } from '@resource/lib/constants/strings';

export const updateEffectKeys = ['x', 'y', 'width', 'height'];

export const bookShapeTypes = {
  // 8x11
  landscape: 'landscape',

  // 8x8
  square: 'square',

  // 11x8
  portrait: 'portrait',
};

// 缩放的主体类型.
export const ratioType = {
  innerWorkspace: 'innerWorkspace',
  innerWorkspaceRatioForNavPages: 'innerWorkspaceRatioForNavPages',
};

// 百分比.
export const percent = {
  full: 1,
  lg: 0.93,
  big: 0.9,
  sl: 0.87,
  normal: 0.75,
  sm: 0.5,
  xs: 0.4,
};

export const sidebarWidth = 400;

export const smallViewHeightInNavPages = 100;

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
