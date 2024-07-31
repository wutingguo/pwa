import { isImmutable } from 'immutable';
import _ from 'lodash';
import dayjs from 'dayjs';
import { projectProsessMap } from '@apps/slide-show/constants/strings';

export function getPropertyValue(obj, prop) {
  if (typeof obj != 'object') {
    return;
  }
  let value = isImmutable(obj) ? obj.get(prop) : obj[prop];
  return value;
}

export function isEmpty(params) {
  if (isImmutable(params)) {
    return !(params && params.size);
  }
  return _.isEmpty(params);
}

export const formatDate = value => (value ? dayjs(value).format('M/DD/YYYY') : value);

export const getCollectionStatus = (status, version) => {
  // 初始化：未发布
  let projectProsess = projectProsessMap.UNPUBLISH;

  if (status === undefined) return;

  switch (status) {
    case 1:
      // 修改中
      projectProsess = projectProsessMap.MODIFYING;
      if (version >= 1) {
        // 可回退
        projectProsess = projectProsessMap.REVERTABLE;
      }
      break;
    case 2:
      // 已发布
      projectProsess = projectProsessMap.PUBLISHED;
      break;
    default:
      break;
  }

  return projectProsess;
};
