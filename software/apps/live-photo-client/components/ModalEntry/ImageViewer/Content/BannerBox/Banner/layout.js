import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: none;
  animation-name: ${bannerAnimation};
  animation-duration: 1s;
  animation-fill-mode: both;
  .target {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 50%;
  }
  .source {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 50%;
  }
`;

const moveLeft = keyframes`
    0% {
      transform: translateX(-100%);
    }
    30%{
      transform: translateX(-100%);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
`;
const rightMoveLeft = keyframes`
    0% {
      transform: translateX(0);
    }
    30%{
      transform: translateX(0);
    }
    100% {
      transform: translateX(100%);
    }
`;

const moveRight = keyframes`
    0% {
      transform: translateX(100%);
    }
    30%{
      transform: translateX(100%);
      opacity: 0;
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
`;

const leftMoveRight = keyframes`
    0% {
      transform: translateX(0);
    }
    30%{
      transform: translateX(0);
    }
    100% {
      transform: translateX(100%);
    }
`;

const moveTop = keyframes`
    from {
      transform: translateY(-100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
`;
const topMoveBottom = keyframes`
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100%);
    }
`;

const moveBottom = keyframes`
    from {
      transform: translateY(-100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
`;

const moveRotateTop = keyframes`
    from {
      transform: rotateX(180deg);
    }
    to {
      opacity: 1;
      transform: rotateX(0);
    }
`;
const moveOpacity = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
`;
const moveOpacityOut = keyframes`
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
`;

const moveRotateScate = keyframes`
    from {
      transform: rotate(-180deg) scale(0);
    }
    to {
      opacity: 1;
      transform: rotate(0) scale(1);
    }
`;

const moveRotateScateOut = keyframes`
    from {
      opacity: 1;
      transform: rotate(0) scale(1);
    }
    to {
      opacity: 0;
      transform: rotate(180deg) scale(0);
    }
`;

function bannerAnimation(props) {
  const { animationType, style } = props;
  const { display } = style || {};
  if (display !== 'block') return;

  if (animationType === 'right') {
    return moveRight;
  } else if (animationType === 'top') {
    return moveTop;
  } else if (animationType === 'bottom') {
    return moveBottom;
  } else if (animationType === 'moveRotateTop') {
    return moveRotateTop;
  } else if (animationType === 'moveRotateScate') {
    return moveRotateScate;
  } else if (animationType === 'left') {
    return moveLeft;
  } else if (animationType === 'moveOpacity') {
    return moveOpacity;
  } else if (animationType === 'topMoveBottom') {
    return topMoveBottom;
  } else if (animationType === 'moveOpacityOut') {
    return moveOpacityOut;
  } else if (animationType === 'moveRotateScateOut') {
    return moveRotateScateOut;
  } else if (animationType === 'leftMoveRight') {
    return leftMoveRight;
  } else if (animationType === 'rightMoveLeft') {
    return rightMoveLeft;
  }
  return;
}
