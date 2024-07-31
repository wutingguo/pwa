export const initPosition = {
  top_bottom_margins: 0,
  left_right_margins: 0,
  transparency: 100,
  scaling_ratio: 10,
  setting_type: 1,
  position_value: 1,
  default_transparency: 100,
  default_scaling_ratio: 10,
};
export const positionKey = [1, 2, 3, 4, 5, 6, 7];

/**
 * 通栏水印设置
 */
export const bannerToPosition = [
  {
    type: positionKey[0],
    top: 0,
    left: 0,
    right: 0,
    bottom: '.',
  },
  {
    type: positionKey[1],
    top: '.',
    left: 0,
    right: 0,
    bottom: 0,
  },
  {
    type: positionKey[2],
    top: 0,
    left: 0,
    right: '.',
    bottom: 0,
  },
  {
    type: positionKey[3],
    top: 0,
    left: '.',
    right: 0,
    bottom: 0,
  },
];

/**
 * 转换通栏水印的边距
 * 上、下边距，宽度为100%
 * 左、右边距，高度为100%
 * @param {Object} water
 */
export const transformBannerPosition = water => {
  const {
    banner_position,
    banner_left_right_margins: left_right = 0,
    banner_top_bottom_margins: top_bottom = 0,
  } = water;
  const rectPos = {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
  };
  const banner_left_right_margins = left_right / 10;
  const banner_top_bottom_margins = top_bottom / 10;
  switch (banner_position) {
    case positionKey[0]:
      rectPos.marginTop += banner_top_bottom_margins;
      rectPos.bannerWidth = '100%';
      break;
    case positionKey[1]:
      rectPos.marginBottom += banner_top_bottom_margins;
      rectPos.bannerWidth = '100%';
      break;
    case positionKey[2]:
      rectPos.marginLeft += banner_left_right_margins;
      rectPos.bannerHeight = '100%';
      break;
    case positionKey[3]:
      rectPos.marginRight += banner_left_right_margins;
      rectPos.bannerHeight = '100%';
      break;
  }
  return rectPos;
};
