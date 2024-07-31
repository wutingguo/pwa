import { isImmutable } from 'immutable';
import _ from 'lodash';

export function getPropertyValue(obj, prop) {
  if (typeof obj != 'object') {
    return;
  }
  let value = isImmutable(obj) ? obj.get(prop) : obj[prop];
  return value;
}
