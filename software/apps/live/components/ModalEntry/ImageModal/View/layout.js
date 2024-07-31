import styled from 'styled-components';

export const Container = styled.div`
  width: calc(100vw - 320px);
  background: #ededed;
  position: relative;

  .left {
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
    cursor: pointer;
  }
  .right {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    transform: rotateY(-180deg);
    cursor: pointer;
  }
`;
