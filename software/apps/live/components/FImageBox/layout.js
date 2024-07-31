import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotateZ(0turn);
  }

  to {
    transform: rotateZ(1turn);
  }
`;

const bottomToTop = keyframes`
  0% {
    transform: translateY(50%);
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 374px;
  height: 212px;
  border: 1px dashed #ccc;
  margin-right: 10px;
  margin-bottom: 10px;
  &.bottomToTop {
    transform: translateY(50%);
    animation: ${bottomToTop} 300ms;
    opacity: 0;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-delay: ${props => props.delay * 100}ms;
  }
  .loading {
    animation: ${rotate} 2.5s linear infinite;
    width: 40px;
  }
  .loading_error {
    width: 40px;
  }
`;

export const CloseElement = styled.div`
  position: absolute;
  right: -10px;
  top: -10px;
  width: 20px;
  height: 20px;

  display: none;
  overflow: hidden;
  .close {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  ${Container}:hover & {
    display: block;
  }
`;

export const ImageItem = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  .success {
    width: 20px;
    position: absolute;
    bottom: 2px;
    right: 2px;
  }
`;
