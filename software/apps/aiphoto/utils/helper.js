import { isImmutable } from 'immutable';
import _ from 'lodash';
import dayjs from 'dayjs';

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

export const formatDate = value => {
  let format = __isCN__ ? 'YYYY/MM/DD' : 'M/DD/YYYY';
  return value ? dayjs(value).format(format) : value;
};
