import { computedWorkSpaceRatio } from './screen';
import { checkBookShapeType } from './bookShape';
import {
  bookShapeTypes,
  ratioType,
  percent,
  sidebarWidth,
  smallViewHeightInNavPages
} from '../constants/strings';

const computedWorkSpaceRatioForNavPages = spreadSize => {
  let ratio = 0;
  if (spreadSize && spreadSize.height) {
    ratio = smallViewHeightInNavPages / spreadSize.height;
    // ratio = smallViewWidthInArrangePages / spreadSize.width;
  }

  return ratio;
};

/**
 * 计算workspace的偏移量.
 * @return {object} {top, right, bottom, left}
 */
export const computedWorkSpaceOffset = productSize => {
  // 定义一个默认的值.
  let top = 134;
  let right = 208;
  let bottom = 146;
  let left = 208;

  // 判断当前的书是landscape/square/portrait
  const type = checkBookShapeType(productSize);

  // switch (type) {
  //   case bookShapeTypes.square: {
  //     top = 100;
  //     right = 50;
  //     bottom = 40;
  //     left = sidebarWidth + 60;
  //
  //     break;
  //   }
  //   case bookShapeTypes.portrait: {
  //     top = 160;
  //     right = 80;
  //     bottom = 80;
  //     left = sidebarWidth + 40;
  //
  //     break;
  //   }
  //   case bookShapeTypes.landscape: {
  //     top = 100;
  //     right = 80;
  //     bottom = 80;
  //     left = sidebarWidth + 60;
  //
  //     break;
  //   }
  //   default: {
  //     break;
  //   }
  // }
  return { top, right, bottom, left };
};

/**
 * 重新计算spread在当前页面上的缩放比.
 * @param that editPage组件的this指向.
 * @param spreadSize
 */
export const updateWorkspaceRatio = (boundProjectActions, size, offset) => {
  const { top = 130, right = 0, bottom = 150, left = 320 } = offset || {};
  const innerWorkspaceRatio = computedWorkSpaceRatio(
    size.innerSpreadSizeForRatio,
    {
      top,
      right,
      bottom,
      left
    },
    percent.lg
  );

  // 计算在nav pages上每一个sheet的ratio.
  const innerWorkspaceRatioForNavPages = computedWorkSpaceRatioForNavPages(
    size.innerSpreadSizeForRatio
  );

  boundProjectActions.updateRatio([
    { type: ratioType.innerWorkspace, ratio: innerWorkspaceRatio },
    {
      type: ratioType.innerWorkspaceRatioForNavPages,
      ratio: innerWorkspaceRatioForNavPages
    }
  ]);
};
