import classNames from 'classnames';
import React, { forwardRef, useRef } from 'react';

import DownOutlined from './DownOutlined';
import UpOutlined from './UpOutlined';

import './index.scss';

const clsPrefix = 'input-number';
const InputNumber = props => {
  const {
    className,
    style,
    handleWidth,
    handleIconFontSize,
    value = 0,
    step = 1,
    controls = true,
    max = Number.MAX_SAFE_INTEGER,
    min = Number.MIN_SAFE_INTEGER,
    onChange,
  } = props;
  const inputRef = useRef(null);

  const handleClickUp = () => {
    const num = parseInt(+inputRef.current.value) + step;
    inputRef.current.value = Math.min(max, num);
    onChange?.(inputRef.current.value);
  };

  const handleClickDown = () => {
    const num = parseInt(+inputRef.current.value) - step;
    inputRef.current.value = Math.max(min, num);
    onChange?.(inputRef.current.value);
  };

  const handleChange = e => {
    let v = parseInt(+e.target.value);
    if (v < min) {
      onChange?.(min);
      return;
    } else if (v > max) {
      onChange?.(max);
      return;
    }
    onChange?.(v);
  };

  const inputNumberCls = classNames(clsPrefix, className);

  const renderInputHandler = () => {
    if (!controls) return null;
    return (
      <div
        className={`${clsPrefix}-handler-wrap`}
        style={{ width: handleWidth, fontSize: handleIconFontSize }}
      >
        <span className={`${clsPrefix}-handler ${clsPrefix}-handler-up`} onClick={handleClickUp}>
          <UpOutlined />
        </span>
        <span
          className={`${clsPrefix}-handler ${clsPrefix}-handler-down`}
          onClick={handleClickDown}
        >
          <DownOutlined />
        </span>
      </div>
    );
  };

  return (
    <div className={inputNumberCls} style={style}>
      <div className={`${clsPrefix}-input-wrap`}>
        <input
          ref={inputRef}
          className={`${clsPrefix}-input`}
          type="number"
          max={max}
          min={min}
          value={`${value}`}
          onChange={handleChange}
        />
      </div>
      {renderInputHandler()}
    </div>
  );
};

export default InputNumber;
