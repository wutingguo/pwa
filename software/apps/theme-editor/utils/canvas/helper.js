import { elementTypes } from '@resource/lib/constants/strings';

export const setBackgroundLowest = elementArray => {
  return elementArray.map(ele => {
    if (ele.get('type') === elementTypes.background) {
      return ele.merge({
        depth: -1200
      });
    }
    return ele;
  });
};

/**
 * 根据elements的zindex进行升序排序.
 * @param  {Immutable.List}  elements 待排序的elements集合
 */
export const sortElementsByZIndex = elements => {
  let newElements = setBackgroundLowest(elements);
  return newElements
    .sort((e1, e2) => {
      const zIndex1 = e1.get('depth');
      const zIndex2 = e2.get('depth');

      if (zIndex1 > zIndex2) {
        return 1;
      } else if (zIndex1 < zIndex2) {
        return -1;
      }
      return 0;
    })
    .map((ele, index) => {
      return ele.merge({ zIndex: index + 1 });
    });
};

export const getRenderElementOptions = element => {
  const offset = {
    x: element ? element.get('width') / 2 : 0,
    y: element ? element.get('height') / 2 : 0
  };

  const x = element ? element.get('x') + offset.x : 0;
  const y = element ? element.get('y') + offset.y : 0;
  const width = element ? element.get('width') : 0;
  const height = element ? element.get('height') : 0;
  const zIndex = element ? element.get('zIndex') : 0;
  const image = element ? element.get('image') : null;

  const rot = element.get('rot');
  const id = element.get('id');

  return {
    image,
    offset,
    x,
    y,
    width,
    height,
    zIndex,
    rot,
    id
  };
};
