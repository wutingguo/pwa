import {
  defaultApplyObjMeta,
  defaultCraftMeta,
  stickerTypes,
} from '@apps/theme-editor/constants/strings';

class BaseElement {
  constructor(option) {
    const {
      id = '',
      width = 0,
      height = 0,
      dep = 1,
      rot = 0,
      x = 0,
      y = 0,
      pw = 0,
      ph = 0,
      px = 0,
      py = 0,
      cropLUX = 0,
      cropLUY = 0,
      cropRLX = 1,
      cropRLY = 1,
      designObjType = 'ART',
      craftType = 'NULL',
      craftParams = {},
      decorationResourceType = '',
      decorationResourceId = '',
      graphicObjType = 'IMAGE',
      decorationGraphicLayerId = '',
      graphicMeta = {},
      applyObjMeta = defaultApplyObjMeta,
      craftMeta = defaultCraftMeta,
    } = option;

    this.id = id;
    this.width = width;
    this.height = height;
    this.dep = dep;
    this.rot = rot;
    this.x = x;
    this.y = y;
    this.pw = pw;
    this.ph = ph;
    this.px = px;
    this.py = py;
    this.cropLUX = cropLUX;
    this.cropLUY = cropLUY;
    this.cropRLX = cropRLX;
    this.cropRLY = cropRLY;
    this.designObjType = designObjType;
    this.craftType = craftType;
    this.craftType = craftType;
    this.craftParams = craftParams;
    this.decorationResourceType = decorationResourceType;
    this.decorationResourceId = decorationResourceId;
    this.decorationResourceId = decorationResourceId;
    this.decorationGraphicLayerId = decorationGraphicLayerId;
    this.graphicMeta = graphicMeta;
    this.applyObjMeta = applyObjMeta;
    this.craftMeta = craftMeta;
  }
}

export class PhotoElement extends BaseElement {
  constructor(baseOption, elementParams) {
    super(baseOption);
    const {
      type = 'PhotoElement',
      elType = 'image',
      encImgId = '',
      imageid = '',
      imgFlip = false,
      imgRot = 0,
      lastModified = 0,
      maskElementIds = [],
      groupIds = [],
    } = elementParams;
    this.type = type;
    this.elType = elType;
    this.encImgId = encImgId;
    this.imageid = imageid;
    this.imgFlip = imgFlip;
    this.imgRot = imgRot;
    this.lastModified = lastModified;
    this.maskElementIds = maskElementIds;
    this.groupIds = groupIds;
  }
}

export class BackgroundElement extends BaseElement {
  constructor(baseOption, elementParams) {
    super(baseOption);
    const {
      type = 'BackgroundElement',
      backgroundId = '',
      suffix = 'jpg',
      imgRot = 0,
      lastModified = 0,
    } = elementParams;
    this.type = type;
    this.backgroundId = backgroundId;
    this.suffix = suffix;
    this.imgRot = imgRot;
    this.lastModified = lastModified;
  }
}

export class StickerElement extends BaseElement {
  constructor(baseOption, elementParams) {
    super(baseOption);
    const {
      type = 'StickerElement',
      boundElementId = null,
      stickerType = stickerTypes.Others,
      decorationId = null,
      maskType = null,
      lastModified = 0,
      groupIds = [],
      category = null,
    } = elementParams;
    this.type = type;
    this.boundElementId = boundElementId;
    this.stickerType = stickerType;
    this.decorationId = decorationId;
    this.maskType = maskType;
    this.category = category;
    this.lastModified = lastModified;
    this.groupIds = groupIds;
  }
}
