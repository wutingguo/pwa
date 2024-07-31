import React, { useRef } from 'react';

import IconLeft from '@apps/live/components/Icons/IconLeft';

import { Container, Operator } from './layout';

export default function FInputNumber(props) {
  const {
    value,
    onChange,
    max = Number.MAX_SAFE_INTEGER,
    min = Number.MIN_SAFE_INTEGER,
    style,
    width,
    ...rest
  } = props;
  const inputRef = useRef(null);

  function clickTop(type) {
    if (type === 'top') {
      const num = Number(inputRef.current.value) + 1;
      inputRef.current.value = Math.min(max, num);
      onChange?.(inputRef.current.value);
    } else if (type === 'down') {
      const num = Number(inputRef.current.value) - 1;
      inputRef.current.value = Math.max(min, num);
      onChange?.(inputRef.current.value);
    }
  }

  function handleChange(e) {
    const { isInteger = false } = props;
    let v = e.target.value;
    const num = Number(v);
    if (v === '') {
      onChange?.(v);
      return;
    }

    if (num < min) {
      onChange?.(min);
      return;
    } else if (num > max) {
      onChange?.(max);
      return;
    }

    // 整数
    if (isInteger) {
      v = Math.floor(v);
    }

    onChange?.(v);
  }
  return (
    <Container style={style}>
      <input
        value={value}
        type="number"
        className="input_number"
        ref={inputRef}
        onChange={handleChange}
        style={{ width }}
        {...rest}
      />
      <Operator>
        <div className="icon_top" onClick={() => clickTop('top')}>
          <IconLeft className="icon" />
        </div>
        <div className="icon_down" onClick={() => clickTop('down')}>
          <IconLeft className="icon" />
        </div>
      </Operator>
    </Container>
  );
}
