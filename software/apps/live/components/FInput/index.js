import React, { forwardRef, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import FTextArea from './FTextArea';

const Container = styled.div`
  position: relative;
  font-size: 14px;
`;

const Count = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
  font-weight: 400;
  color: #7b7b7b;
  line-height: 14px;
`;
const Input = styled.input`
  height: 40px;
  border: 1px solid #d8d8d8;
  width: 100%;
  outline: none;
  padding: 0 10px;
  box-sizing: border-box;
`;

const FInput = forwardRef(function (porps, ref) {
  const { max, value, width, height, onClick, containerStyle, maxNumber, ...rest } = porps;
  const [padding, setPadding] = useState('');
  const len = value?.length || 0;
  const boxRef = useRef(null);

  useEffect(() => {
    if (!boxRef.current) return;
    const w = boxRef.current.getBoundingClientRect().width + 10;
    const p = `0px ${w}px 0px 10px`;
    setPadding(p);
  }, [len]);
  return (
    <Container onClick={onClick} style={containerStyle}>
      <Input
        ref={ref}
        maxLength={max}
        max={maxNumber}
        value={value}
        style={{ width, height, padding }}
        {...rest}
      />
      {max && max > 0 ? <Count ref={boxRef}>{`${len}/${max}`}</Count> : null}
    </Container>
  );
});

export default FInput;
FInput.Textarea = FTextArea;
