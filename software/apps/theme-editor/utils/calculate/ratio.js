import { get, merge } from 'lodash';

import { getSpreadSize, getRenderSize } from '../sizeCalculator';
import { updateWorkspaceRatio, computedWorkSpaceOffset } from '../computedRatio';

const updateWorkspaceRatios = args => {
  const { boundProjectActions, productSize, size } = args;

  const offset = computedWorkSpaceOffset(productSize);

  updateWorkspaceRatio(boundProjectActions, size, offset);
};

const getSpreadSizeForRatio = pageArray => {
  const innerSpreadSize = getSpreadSize(pageArray);
  const innerSpreadSizeForRatio = {
    width: innerSpreadSize.width,
    height: innerSpreadSize.height,
    bleed: innerSpreadSize.bleed
  };
  return {
    innerSpreadSizeForRatio
  };
};

const updateRatios = (opt = {}) => {
  const { presentTheme, boundProjectActions } = opt;
  let { pageArray } = presentTheme;

  if (!pageArray || !pageArray.size) return null;
  const firstPage = pageArray.first();
  const productSize = {
    width: firstPage.get('width'),
    height: firstPage.get('height')
  };

  const size = getSpreadSizeForRatio(pageArray);

  const computeParams = {
    boundProjectActions,
    productSize,
    size
  };

  updateWorkspaceRatios(computeParams);
};

export const checkAndUpdateProjectRatio = opt => {
  updateRatios(opt);
};
