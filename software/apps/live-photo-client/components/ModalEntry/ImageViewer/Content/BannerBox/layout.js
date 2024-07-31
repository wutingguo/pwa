import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 8px 0;
  &.dark {
    background: rgba(0, 0, 0, 1);
  }
  .box {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
  }

  .left {
    position: absolute;
    left: 0;
    cursor: pointer;
    width: 40px;
    text-align: center;
    margin-left: 40px;
    z-index: 4;
    &.disabled {
      cursor: no-drop;
    }
  }
  .right {
    position: absolute;
    right: 0;
    cursor: pointer;
    width: 40px;
    text-align: center;
    margin-right: 40px;
    z-index: 4;
    transform: rotateY(180deg);
    &.disabled {
      cursor: no-drop;
    }
  }
`;
