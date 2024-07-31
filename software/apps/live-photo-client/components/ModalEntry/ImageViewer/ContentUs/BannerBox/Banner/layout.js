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

const moveTop = keyframes`
    from {
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
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

const moveRotateScate = keyframes`
    from {
      transform: rotate(-180deg) scale(0);
    }
    to {
      opacity: 1;
      transform: rotate(0) scale(1);
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
  }
  return;
}
