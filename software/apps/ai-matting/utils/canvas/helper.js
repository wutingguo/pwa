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
  const computed = element.get('computed');

  const offset = {
    x: computed ? Math.round(computed.get('width') / 2) : 0,
    y: computed ? Math.round(computed.get('height') / 2) : 0
  };

  const imgUrl = computed ? computed.get('imgUrl') : '';
  const mattingMaskUrl = computed ? computed.get('mattingMaskUrl') : '';
  const x = Math.round(computed ? computed.get('left') + offset.x : 0);
  const y = Math.round(computed ? computed.get('top') + offset.y : 0);
  let width = computed ? Math.floor(computed.get('width')) : 0;
  let height = computed ? Math.floor(computed.get('height')) : 0;
  //存在colorTypeImageUrl则证明该元素需要canvas进行合成，为了避免canvas绘制报错，需要保证计算出来的宽高不为0
  const colorTypeImageUrl = computed.get('colorTypeImageUrl');
  if (colorTypeImageUrl) {
    width = computed ? Math.ceil(computed.get('width')) : 0;
    height = computed ? Math.ceil(computed.get('height')) : 0;
  }
  const zIndex = element ? element.get('depth') : 0;

  const rot = element.get('rot');
  const id = element.get('id');

  return {
    imgUrl,
    mattingMaskUrl,
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
