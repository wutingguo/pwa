import styled from 'styled-components';

export const Container = styled.div`
  height: 62px;
  background-color: #f6f6f6;
  display: flex;
  ailgn-items: center;
  justify-content: center;
  align-items: center;
  &.hidden {
    height: 0;
    overflow: hidden;
    padding: 0;
  }
  .rotate {
    transform: rotate(180deg);
  }
`;

export const Line = styled.div`
  display: inline-block;
  width: 2px;
  height: 25px;
  background: #d8d8d8;
`;

export const DirectionLine = styled.div`
  color: #fff;
  padding: 5px;
  white-space: nowrap;
`;
