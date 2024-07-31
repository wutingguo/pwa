import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
`;

const Textarea = styled.textarea`
  border: 1px solid #d8d8d8;
  outline: none;
  width: 100%;
  font-size: 14px;
  padding: 10px 10px 20px 10px;
  outline: none;
  resize: none;
  box-sizing: border-box;
`;

const Count = styled.div`
  position: absolute;
  bottom: 14px;
  right: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #7b7b7b;
  line-height: 14px;
`;

export default function FTextarea(porps) {
  const { max, value, onChange, width, height, ...rest } = porps;
  const w = width ? width + 22 : '100%';
  const len = value?.length || 0;

  return (
    <Container style={{ width: w, height }}>
      <Textarea
        maxLength={max}
        rows={5}
        onChange={onChange}
        value={value}
        style={{ width, height }}
        {...rest}
      />
      {max && max > 0 ? <Count>{`${len}/${max}`}</Count> : null}
    </Container>
  );
}
