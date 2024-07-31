import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

export const Image = styled.img`
  position: absolute;
  max-width: calc(100vw - 320px);
  max-height: 100vh;
  user-select: none;
  height: 100%;
  top: 0;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  object-fit: contain; // 保持原始比例缩放
`;
