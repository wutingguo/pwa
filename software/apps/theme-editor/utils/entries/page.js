import { merge } from 'lodash';

import { elementTypes } from '@resource/lib/constants/strings';

import { decorationResourceTypes, stickerTypes } from '@apps/theme-editor/constants/strings';

import { BackgroundElement, PhotoElement, StickerElement } from './element';

class Page {
  constructor({ page, stickers, backgrounds }) {
    this.type = 'Sheet';
    this.bgColor = '#fff';
    this.elements = [];
    this.groups = [];
    this.width = 0;
    this.height = 0;
    this.id = '';
    this.backend = { slice: false, isPrint: true };
    this.meta = {
      dropZones: [],
      edit: {
        allowEdit: true,
      },
    };
    this.template = {
      tplGuid: '',
    };
    this.init({ page, stickers, backgrounds });
  }

  convertElement({ element, stickers, backgrounds }) {
    let newElement = {};
    const {
      id,
      x,
      y,
      width,
      height,
      px,
      py,
      pw,
      ph,
      name,
      type,
      depth,
      boundElementId = '',
      maskElementIds = [],
      groupIds = [],
      maskType = null,
      stickerType = stickerTypes.Others,
      lastModified,
    } = element;
    const commonParams = {
      id,
      x,
      y,
      width,
      height,
      px,
      py,
      pw,
      ph,
      dep: depth,
      decorationGraphicLayerId: name,
    };

    switch (element.type) {
      case elementTypes.sticker:
        const originalSticker = stickers.find(item => item.id === id);
        if (originalSticker) {
          const { pictureId } = originalSticker;
          commonParams.decorationResourceId = pictureId;
          commonParams.decorationResourceType = decorationResourceTypes.sticker;
          const stickerElementParams = {
            type,
            boundElementId,
            maskType,
            stickerType,
            groupIds,
            lastModified,
            decorationId: pictureId,
          };
          newElement = new StickerElement(commonParams, stickerElementParams);
        }
        break;
      case elementTypes.photo:
        const photoElementParams = {
          type,
          lastModified,
          maskElementIds,
          groupIds,
        };
        newElement = new PhotoElement(commonParams, photoElementParams);

        break;
      case elementTypes.background:
        const originalBackground = backgrounds.find(item => item.id === id);
        if (originalBackground) {
          const { pictureId } = originalBackground;
          commonParams.decorationResourceId = pictureId;
          commonParams.decorationResourceType = decorationResourceTypes.background;
          const backgroundElementParams = {
            type,
            lastModified,
            backgroundId: pictureId,
          };
          newElement = new BackgroundElement(commonParams, backgroundElementParams);
        }
        break;
      default:
        newElement = {};
    }
    return newElement;
  }

  getElements({ elements, stickers, backgrounds }) {
    return elements.reduce((prev, current) => {
      const newElement = this.convertElement({ element: current, stickers, backgrounds });
      prev.push(newElement);
      return prev;
    }, []);
  }

  init(opt) {
    const { page, stickers, backgrounds } = opt;
    const { width, height, elements, id } = page;
    this.elements = this.getElements({ elements, stickers, backgrounds });
    this.width = width;
    this.height = height;
    this.id = id;
  }
}

export default Page;
