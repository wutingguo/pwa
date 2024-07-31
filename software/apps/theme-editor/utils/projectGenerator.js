import { fromJS } from 'immutable';

import { chekIsTransparent } from '@resource/lib/utils/image';
import { guid } from '@resource/lib/utils/math';

import { elementTypes } from '@resource/lib/constants/strings';

import { stickerTypes } from '@apps/theme-editor/constants/strings';
import Theme from '@apps/theme-editor/utils/entries/theme';

export const convertPageArray = pageArray => {
  let newPageArray = pageArray;
  newPageArray = newPageArray.map(page => {
    let newElements = page.get('elements');
    const pageElements = page.get('elements');
    let photoElements = pageElements.filter(element => element.get('type') === elementTypes.photo);
    const includeTypes = [elementTypes.sticker, elementTypes.background];
    const restElements = pageElements.filter(element => includeTypes.includes(element.get('type')));

    if (photoElements.size) {
      const addedStickers = photoElements.reduce((prev, current) => {
        const { id, image, file } = current.toJS();
        const isTransparentImage = chekIsTransparent(image);

        // 对图片进行透明点检测，只有包含透明点的素材，才会被转成蒙版
        if (isTransparentImage) {
          const stickerElement = {
            ...current.toJS(),
            id: guid(),
            image,
            file,
            groupIds: [guid()],
            boundElementId: id,
            maskType: stickerTypes.Masks,
            stickerType: stickerTypes.Masks,
            type: elementTypes.sticker,
          };
          prev = prev.push(fromJS(stickerElement));
        }
        return prev;
      }, fromJS([]));
      photoElements = photoElements.map(element => {
        const stickerElement = addedStickers.find(
          ele => ele.get('boundElementId') === element.get('id')
        );
        if (stickerElement) {
          element = element.set('maskElementIds', fromJS([stickerElement.get('id')]));
          element = element.set('groupIds', fromJS(stickerElement.get('groupIds')));
          return element;
        }
        return element;
      });
      newElements = restElements.concat(addedStickers, photoElements);
    }
    return page.set('elements', newElements);
  });
  return newPageArray;
};

export const generateTheme = (params = {}) => {
  const { backgrounds, stickers, pageArray, title } = params;

  const theme = new Theme({ stickers, backgrounds, pageArray, title });
  console.log('theme===>', theme);

  return theme;
};
