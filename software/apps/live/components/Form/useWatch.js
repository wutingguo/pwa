import React, { useEffect } from 'react';

import { INTERNAL_HOOKS } from './constants';

export default function useWatch(namePath, form) {
  const [value, setValue] = React.useState('');
  const valueRef = React.useRef(value);
  valueRef.current = value;

  useEffect(() => {
    if (!form) return;

    const { getInternalHooks } = form;
    const cancel = getInternalHooks(INTERNAL_HOOKS).registerWatch(values => {
      const val = getValue(values, namePath);
      if (!diffValue(val, valueRef.current)) {
        setValue(val);
      }
    });
    return cancel;
  }, [form]);

  return value;
}

function getValue(vlaues, namePath) {
  if (typeof namePath === 'string') {
    return vlaues[namePath];
  } else if (namePath instanceof Array) {
    const obj = Object.create(null);
    // 兼容空数组，在字段数量比较多时，不推荐使用空数组
    if (namePath.length === 0) {
      return vlaues;
    }
    namePath.forEach(key => {
      if (key in vlaues) {
        obj[key] = vlaues[key];
      }
    });
    return obj;
  } else if (typeof namePath === 'function') {
    // 兼容selector,自定义
    return namePath(vlaues);
  }

  return '';
}

function diffValue(newValue, oldValue) {
  if (!equalityValue(newValue, oldValue)) {
    if (
      newValue !== null &&
      oldValue !== null &&
      typeof newValue === 'object' &&
      typeof oldValue === 'object'
    ) {
      // 对象浅比较
      for (const key in newValue) {
        if (!equalityValue(oldValue[key], newValue[key])) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  return true;
}

function equalityValue(newValue, oldValue) {
  return newValue === oldValue;
}
